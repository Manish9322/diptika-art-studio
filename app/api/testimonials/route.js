import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Testimonial from '@/models/testimonial.model';
import { verifyAdminToken } from '@/utils/authMiddleware';
import { uploadSingleImage, uploadBase64Image } from '@/utils/cloudinary';

// GET - Fetch all testimonials or a specific testimonial
export async function GET(request) {
  try {
    await _db();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    
    if (id) {
      // Get single testimonial
      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        return NextResponse.json(
          { success: false, message: 'Testimonial not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: testimonial });
    }
    
    // Build query for multiple testimonials
    let query = { active: true };
    
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    let testimonialsQuery = Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    
    if (limit) {
      testimonialsQuery = testimonialsQuery.limit(parseInt(limit));
    }
    
    const testimonials = await testimonialsQuery;
    
    return NextResponse.json({ 
      success: true, 
      data: testimonials 
    });
    
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new testimonial (Protected)
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
    let testimonialData = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with image uploads)
      const formData = await request.formData();
      
      // Extract form fields
      const clientName = formData.get('clientName');
      const role = formData.get('role');
      const content = formData.get('content');
      const date = formData.get('date');
      const featured = formData.get('featured') === 'true';
      const active = formData.get('active') === 'true';
      const order = parseInt(formData.get('order') || '0');
      
      // Validate required fields
      if (!clientName || !role || !content || !date) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Please provide all required fields: clientName, role, content, date' 
          },
          { status: 400 }
        );
      }
      
      // Handle image upload
      let imageUrl = '';
      const imageFile = formData.get('image');
      
      if (imageFile && imageFile.name) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadedImage = await uploadSingleImage(buffer, imageFile.type, 'testimonials');
        imageUrl = uploadedImage.url;
      }
      
      testimonialData = {
        clientName,
        role,
        content,
        date,
        image: imageUrl,
        featured,
        active,
        order
      };
    } else {
      // Handle JSON (backward compatibility - check if image needs uploading)
      const body = await request.json();
      
      // Validate required fields
      if (!body.clientName || !body.role || !body.content || !body.date) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Please provide all required fields: clientName, role, content, date' 
          },
          { status: 400 }
        );
      }
      
      // Check if image is base64 or URL
      let imageUrl = body.image || '';
      if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.length > 500) && !imageUrl.startsWith('http')) {
        // Upload base64 to Cloudinary
        const uploaded = await uploadBase64Image(imageUrl, 'testimonials');
        imageUrl = uploaded.url;
      }
      
      testimonialData = {
        ...body,
        image: imageUrl
      };
    }
    
    // Create new testimonial
    const testimonial = await Testimonial.create(testimonialData);
    
    return NextResponse.json(
      { success: true, data: testimonial, message: 'Testimonial created successfully' },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create testimonial', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a testimonial (Protected)
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
        { success: false, message: 'Testimonial ID is required' },
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
      const clientName = formData.get('clientName');
      const role = formData.get('role');
      const content = formData.get('content');
      const date = formData.get('date');
      const featured = formData.get('featured') === 'true';
      const active = formData.get('active') === 'true';
      const order = formData.get('order') ? parseInt(formData.get('order')) : undefined;
      const existingImage = formData.get('existingImage');
      
      // Prepare update object
      if (clientName) updateData.clientName = clientName;
      if (role) updateData.role = role;
      if (content) updateData.content = content;
      if (date) updateData.date = date;
      if (formData.has('featured')) updateData.featured = featured;
      if (formData.has('active')) updateData.active = active;
      if (order !== undefined) updateData.order = order;
      if (existingImage) updateData.image = existingImage;
      
      // Handle new image upload
      const newImageFile = formData.get('newImage');
      
      if (newImageFile && newImageFile.name) {
        const buffer = Buffer.from(await newImageFile.arrayBuffer());
        const uploadedImage = await uploadSingleImage(buffer, newImageFile.type, 'testimonials');
        updateData.image = uploadedImage.url;
      }
    } else {
      // Handle JSON (backward compatibility - check if image needs uploading)
      const body = await request.json();
      
      // Check if image is base64 or URL
      let imageUrl = body.image;
      if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.length > 500) && !imageUrl.startsWith('http')) {
        // Upload base64 to Cloudinary
        const uploaded = await uploadBase64Image(imageUrl, 'testimonials');
        imageUrl = uploaded.url;
      }
      
      updateData = {
        ...body,
        image: imageUrl || body.image
      };
    }
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: testimonial, 
      message: 'Testimonial updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update testimonial', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a testimonial (Protected)
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
        { success: false, message: 'Testimonial ID is required' },
        { status: 400 }
      );
    }
    
    const testimonial = await Testimonial.findByIdAndDelete(id);
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Testimonial deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete testimonial', error: error.message },
      { status: 500 }
    );
  }
}
