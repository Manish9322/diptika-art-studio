import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Artwork from '@/models/artwork.model';
import { verifyAdminToken } from '@/utils/authMiddleware';
import { uploadMultipleImages, uploadMultipleBase64Images } from '@/utils/cloudinary';

// GET - Fetch all artworks with optional filters
export async function GET(request) {
  try {
    await _db();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Execute query
    let artworksQuery = Artwork.find(query).sort({ order: 1, createdAt: -1 });
    
    if (limit) {
      artworksQuery = artworksQuery.limit(parseInt(limit));
    }
    
    const artworks = await artworksQuery.exec();
    
    return NextResponse.json({
      success: true,
      count: artworks.length,
      data: artworks
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching artworks',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Create a new artwork (Protected)
export async function POST(request) {
  try {
    // Verify admin token
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
      return authResult.response;
    }
    
    await _db();
    
    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    let artworkData = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with image uploads)
      const formData = await request.formData();
      
      // Extract form fields
      const title = formData.get('title');
      const category = formData.get('category');
      const description = formData.get('description');
      const date = formData.get('date');
      const medium = formData.get('medium') || 'Mixed Media';
      const context = formData.get('context') || 'Personal';
      const featured = formData.get('featured') === 'true';
      const active = formData.get('active') === 'true';
      const order = parseInt(formData.get('order') || '0');
      const price = formData.get('price') || '';
      const currency = formData.get('currency') || 'INR';
      
      // Validate required fields
      if (!title || !category || !description || !date) {
        return NextResponse.json({
          success: false,
          message: 'Please provide all required fields: title, category, description, date'
        }, { status: 400 });
      }
      
      // Handle image uploads
      const imageFiles = formData.getAll('images');
      
      if (!imageFiles || imageFiles.length === 0 || (imageFiles.length === 1 && !imageFiles[0].name)) {
        return NextResponse.json({
          success: false,
          message: 'At least one image is required'
        }, { status: 400 });
      }
      
      // Prepare files for upload
      const filesToUpload = [];
      for (const file of imageFiles) {
        if (file && file.name) {
          const buffer = Buffer.from(await file.arrayBuffer());
          filesToUpload.push({
            buffer,
            mimetype: file.type
          });
        }
      }
      
      if (filesToUpload.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'No valid image files provided'
        }, { status: 400 });
      }
      
      // Upload images to Cloudinary
      const uploadedImages = await uploadMultipleImages(filesToUpload, 'artworks');
      const imageUrls = uploadedImages.map(img => img.url);
      
      artworkData = {
        title,
        category,
        images: imageUrls,
        description,
        medium,
        context,
        date,
        featured,
        active,
        order,
        price,
        currency
      };
    } else {
      // Handle JSON (backward compatibility - check if images need uploading)
      const body = await request.json();
      
      // Validate required fields
      if (!body.title || !body.category || !body.images || !body.description || !body.date) {
        return NextResponse.json({
          success: false,
          message: 'Please provide all required fields: title, category, images, description, date'
        }, { status: 400 });
      }
      
      // Check if images are base64 or URLs
      let imageUrls = [];
      if (Array.isArray(body.images)) {
        for (const img of body.images) {
          // If image is base64 or data URI, upload to Cloudinary
          if (img && (img.startsWith('data:') || img.length > 500)) {
            const uploaded = await uploadMultipleBase64Images([img], 'artworks');
            imageUrls.push(uploaded[0].url);
          } else if (img && img.startsWith('http')) {
            // Already a URL, keep it
            imageUrls.push(img);
          }
        }
      }
      
      artworkData = {
        ...body,
        images: imageUrls.length > 0 ? imageUrls : body.images
      };
    }
    
    // Create artwork
    const artwork = await Artwork.create(artworkData);
    
    return NextResponse.json({
      success: true,
      message: 'Artwork created successfully',
      data: artwork
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating artwork:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        error: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Error creating artwork',
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Update an artwork (Protected)
export async function PUT(request) {
  try {
    // Verify admin token
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
      return authResult.response;
    }
    
    await _db();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Artwork ID is required'
      }, { status: 400 });
    }
    
    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    let updateData = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with image uploads)
      const formData = await request.formData();
      
      // Extract form fields
      const title = formData.get('title');
      const category = formData.get('category');
      const description = formData.get('description');
      const date = formData.get('date');
      const medium = formData.get('medium');
      const context = formData.get('context');
      const featured = formData.get('featured') === 'true';
      const active = formData.get('active') === 'true';
      const order = formData.get('order') ? parseInt(formData.get('order')) : undefined;
      const price = formData.get('price');
      const currency = formData.get('currency');
      
      // Check for existing images (URLs from the form)
      const existingImages = formData.get('existingImages');
      let imageUrls = existingImages ? JSON.parse(existingImages) : [];
      
      // Handle new image uploads
      const newImageFiles = formData.getAll('newImages');
      
      if (newImageFiles && newImageFiles.length > 0 && newImageFiles[0].name) {
        const filesToUpload = [];
        for (const file of newImageFiles) {
          if (file && file.name) {
            const buffer = Buffer.from(await file.arrayBuffer());
            filesToUpload.push({
              buffer,
              mimetype: file.type
            });
          }
        }
        
        if (filesToUpload.length > 0) {
          const uploadedImages = await uploadMultipleImages(filesToUpload, 'artworks');
          const newImageUrls = uploadedImages.map(img => img.url);
          imageUrls = [...imageUrls, ...newImageUrls];
        }
      }
      
      // Prepare update object
      if (title) updateData.title = title;
      if (category) updateData.category = category;
      if (description) updateData.description = description;
      if (date) updateData.date = date;
      if (medium) updateData.medium = medium;
      if (context) updateData.context = context;
      if (formData.has('featured')) updateData.featured = featured;
      if (formData.has('active')) updateData.active = active;
      if (order !== undefined) updateData.order = order;
      if (price) updateData.price = price;
      if (currency) updateData.currency = currency;
      if (imageUrls.length > 0) updateData.images = imageUrls;
    } else {
      // Handle JSON (backward compatibility - check if images need uploading)
      const body = await request.json();
      
      // Check if images are base64 or URLs
      if (body.images && Array.isArray(body.images)) {
        let imageUrls = [];
        for (const img of body.images) {
          // If image is base64 or data URI, upload to Cloudinary
          if (img && (img.startsWith('data:') || img.length > 500) && !img.startsWith('http')) {
            const uploaded = await uploadMultipleBase64Images([img], 'artworks');
            imageUrls.push(uploaded[0].url);
          } else if (img && img.startsWith('http')) {
            // Already a URL, keep it
            imageUrls.push(img);
          }
        }
        updateData = {
          ...body,
          images: imageUrls.length > 0 ? imageUrls : body.images
        };
      } else {
        updateData = body;
      }
    }
    
    const artwork = await Artwork.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!artwork) {
      return NextResponse.json({
        success: false,
        message: 'Artwork not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Artwork updated successfully',
      data: artwork
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating artwork:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        error: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Error updating artwork',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Delete an artwork (Protected)
export async function DELETE(request) {
  try {
    // Verify admin token
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
      return authResult.response;
    }
    
    await _db();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Artwork ID is required'
      }, { status: 400 });
    }
    
    const artwork = await Artwork.findByIdAndDelete(id);
    
    if (!artwork) {
      return NextResponse.json({
        success: false,
        message: 'Artwork not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Artwork deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return NextResponse.json({
      success: false,
      message: 'Error deleting artwork',
      error: error.message
    }, { status: 500 });
  }
}
