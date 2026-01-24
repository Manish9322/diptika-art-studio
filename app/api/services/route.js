import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Service from '@/models/service.model';
import { verifyAdminToken } from '@/utils/authMiddleware';
import { uploadSingleImage, uploadBase64Image } from '@/utils/cloudinary';

// GET - Fetch all services with optional filters
export async function GET(request) {
  try {
    await _db();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query
    let servicesQuery = Service.find(query).sort({ order: 1, createdAt: -1 });
    
    if (limit) {
      servicesQuery = servicesQuery.limit(parseInt(limit));
    }
    
    const services = await servicesQuery.exec();
    
    return NextResponse.json({
      success: true,
      count: services.length,
      data: services
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Create a new service (Protected)
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
    let serviceData = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with image uploads)
      const formData = await request.formData();
      
      // Extract form fields
      const title = formData.get('title');
      const description = formData.get('description');
      const priceStart = formData.get('priceStart');
      const currency = formData.get('currency') || 'INR';
      const featured = formData.get('featured') === 'true';
      const active = formData.get('active') === 'true';
      const order = parseInt(formData.get('order') || '0');
      
      // Validate required fields
      if (!title || !description || !priceStart) {
        return NextResponse.json({
          success: false,
          message: 'Please provide all required fields: title, description, priceStart'
        }, { status: 400 });
      }
      
      // Handle image upload
      let imageUrl = '';
      const imageFile = formData.get('image');
      
      if (imageFile && imageFile.name) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadedImage = await uploadSingleImage(buffer, imageFile.type, 'services');
        imageUrl = uploadedImage.url;
      }
      
      serviceData = {
        title,
        description,
        priceStart,
        currency,
        image: imageUrl,
        featured,
        active,
        order
      };
    } else {
      // Handle JSON (backward compatibility - check if image needs uploading)
      const body = await request.json();
      
      // Validate required fields
      if (!body.title || !body.description || !body.priceStart) {
        return NextResponse.json({
          success: false,
          message: 'Please provide all required fields: title, description, priceStart'
        }, { status: 400 });
      }
      
      // Check if image is base64 or URL
      let imageUrl = body.image || '';
      if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.length > 500) && !imageUrl.startsWith('http')) {
        // Upload base64 to Cloudinary
        const uploaded = await uploadBase64Image(imageUrl, 'services');
        imageUrl = uploaded.url;
      }
      
      serviceData = {
        ...body,
        image: imageUrl
      };
    }
    
    // Create service
    const service = await Service.create(serviceData);
    
    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: service
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating service:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        error: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Error creating service',
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Update a service (Protected)
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
        message: 'Service ID is required'
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
      const description = formData.get('description');
      const priceStart = formData.get('priceStart');
      const currency = formData.get('currency');
      const featured = formData.get('featured') === 'true';
      const active = formData.get('active') === 'true';
      const order = formData.get('order') ? parseInt(formData.get('order')) : undefined;
      const existingImage = formData.get('existingImage');
      
      // Prepare update object
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (priceStart) updateData.priceStart = priceStart;
      if (currency) updateData.currency = currency;
      if (formData.has('featured')) updateData.featured = featured;
      if (formData.has('active')) updateData.active = active;
      if (order !== undefined) updateData.order = order;
      if (existingImage) updateData.image = existingImage;
      
      // Handle new image upload
      const newImageFile = formData.get('newImage');
      
      if (newImageFile && newImageFile.name) {
        const buffer = Buffer.from(await newImageFile.arrayBuffer());
        const uploadedImage = await uploadSingleImage(buffer, newImageFile.type, 'services');
        updateData.image = uploadedImage.url;
      }
    } else {
      // Handle JSON (backward compatibility - check if image needs uploading)
      const body = await request.json();
      
      // Check if image is base64 or URL
      let imageUrl = body.image;
      if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.length > 500) && !imageUrl.startsWith('http')) {
        // Upload base64 to Cloudinary
        const uploaded = await uploadBase64Image(imageUrl, 'services');
        imageUrl = uploaded.url;
      }
      
      updateData = {
        ...body,
        image: imageUrl || body.image
      };
    }
    
    // Find and update service
    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!service) {
      return NextResponse.json({
        success: false,
        message: 'Service not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating service:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        error: error.message
      }, { status: 400 });
    }
    
    if (error.name === 'CastError') {
      return NextResponse.json({
        success: false,
        message: 'Invalid service ID'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Error updating service',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Delete a service (Protected)
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
        message: 'Service ID is required'
      }, { status: 400 });
    }
    
    // Find the service first to get its title
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json({
        success: false,
        message: 'Service not found'
      }, { status: 404 });
    }
    
    // Check if any artworks are using this service category
    const Artwork = require('@/models/artwork.model').default;
    const artworksUsingService = await Artwork.countDocuments({ category: service.title });
    
    if (artworksUsingService > 0) {
      return NextResponse.json({
        success: false,
        message: `Cannot delete this service category because ${artworksUsingService} artwork${artworksUsingService > 1 ? 's are' : ' is'} using it. Please reassign or delete those artworks first.`
      }, { status: 400 });
    }
    
    // If no artworks are using it, proceed with deletion
    await Service.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
      data: service
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting service:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json({
        success: false,
        message: 'Invalid service ID'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    }, { status: 500 });
  }
}
