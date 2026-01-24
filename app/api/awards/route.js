import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Award from '@/models/award.model';
import { verifyAdminToken } from '@/utils/authMiddleware';
import { uploadSingleImage, uploadBase64Image } from '@/utils/cloudinary';

// GET - Fetch all awards or a specific award
export async function GET(request) {
  try {
    await _db();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const year = searchParams.get('year');
    
    if (id) {
      // Get single award
      const award = await Award.findById(id);
      if (!award) {
        return NextResponse.json(
          { success: false, message: 'Award not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: award });
    }
    
    // Build query for multiple awards
    let query = { active: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (year) {
      query.year = parseInt(year);
    }
    
    let awardsQuery = Award.find(query).sort({ year: -1, order: 1, createdAt: -1 });
    
    if (limit) {
      awardsQuery = awardsQuery.limit(parseInt(limit));
    }
    
    const awards = await awardsQuery;
    
    return NextResponse.json({ 
      success: true, 
      data: awards 
    });
    
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch awards', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new award (Protected)
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
    let awardData = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with image uploads)
      const formData = await request.formData();
      
      // Extract form fields
      const title = formData.get('title');
      const organization = formData.get('organization');
      const year = parseInt(formData.get('year'));
      const description = formData.get('description') || '';
      const category = formData.get('category') || '';
      const certificateUrl = formData.get('certificateUrl') || '';
      const featured = formData.get('featured') === 'true';
      const active = formData.get('active') === 'true';
      const order = parseInt(formData.get('order') || '0');
      
      // Validate required fields
      if (!title || !organization || !year) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Please provide all required fields: title, organization, year' 
          },
          { status: 400 }
        );
      }
      
      // Handle image upload
      let imageUrl = '';
      const imageFile = formData.get('image');
      
      if (imageFile && imageFile.name) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadedImage = await uploadSingleImage(buffer, imageFile.type, 'awards');
        imageUrl = uploadedImage.url;
      }
      
      awardData = {
        title,
        organization,
        year,
        description,
        category,
        image: imageUrl,
        certificateUrl,
        featured,
        active,
        order
      };
    } else {
      // Handle JSON (backward compatibility - check if image needs uploading)
      const body = await request.json();
      
      // Validate required fields
      if (!body.title || !body.organization || !body.year) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Please provide all required fields: title, organization, year' 
          },
          { status: 400 }
        );
      }
      
      // Check if image is base64 or URL
      let imageUrl = body.image || '';
      if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.length > 500) && !imageUrl.startsWith('http')) {
        // Upload base64 to Cloudinary
        const uploaded = await uploadBase64Image(imageUrl, 'awards');
        imageUrl = uploaded.url;
      }
      
      awardData = {
        ...body,
        image: imageUrl
      };
    }
    
    // Create new award
    const award = await Award.create(awardData);
    
    return NextResponse.json(
      { success: true, data: award, message: 'Award created successfully' },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating award:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create award', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update an award (Protected)
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
      return NextResponse.json(
        { success: false, message: 'Award ID is required' },
        { status: 400 }
      );
    }
    
    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    let updateData = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with image uploads)
      const formData = await request.formData();
      
      // Extract form fields
      const title = formData.get('title');
      const organization = formData.get('organization');
      const year = formData.get('year') ? parseInt(formData.get('year')) : undefined;
      const description = formData.get('description');
      const category = formData.get('category');
      const certificateUrl = formData.get('certificateUrl');
      const featured = formData.get('featured') === 'true';
      const active = formData.get('active') === 'true';
      const order = formData.get('order') ? parseInt(formData.get('order')) : undefined;
      const existingImage = formData.get('existingImage');
      
      // Prepare update object
      if (title) updateData.title = title;
      if (organization) updateData.organization = organization;
      if (year !== undefined) updateData.year = year;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (certificateUrl) updateData.certificateUrl = certificateUrl;
      if (formData.has('featured')) updateData.featured = featured;
      if (formData.has('active')) updateData.active = active;
      if (order !== undefined) updateData.order = order;
      if (existingImage) updateData.image = existingImage;
      
      // Handle new image upload
      const newImageFile = formData.get('newImage');
      
      if (newImageFile && newImageFile.name) {
        const buffer = Buffer.from(await newImageFile.arrayBuffer());
        const uploadedImage = await uploadSingleImage(buffer, newImageFile.type, 'awards');
        updateData.image = uploadedImage.url;
      }
    } else {
      // Handle JSON (backward compatibility - check if image needs uploading)
      const body = await request.json();
      
      // Check if image is base64 or URL
      let imageUrl = body.image;
      if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.length > 500) && !imageUrl.startsWith('http')) {
        // Upload base64 to Cloudinary
        const uploaded = await uploadBase64Image(imageUrl, 'awards');
        imageUrl = uploaded.url;
      }
      
      updateData = {
        ...body,
        image: imageUrl || body.image
      };
    }
    
    const award = await Award.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!award) {
      return NextResponse.json(
        { success: false, message: 'Award not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: award, 
      message: 'Award updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating award:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update award', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete an award (Protected)
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
      return NextResponse.json(
        { success: false, message: 'Award ID is required' },
        { status: 400 }
      );
    }
    
    const award = await Award.findByIdAndDelete(id);
    
    if (!award) {
      return NextResponse.json(
        { success: false, message: 'Award not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Award deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting award:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete award', error: error.message },
      { status: 500 }
    );
  }
}
