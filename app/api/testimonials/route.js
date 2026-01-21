import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Testimonial from '@/models/testimonial.model';

// GET - Fetch all testimonials or a specific testimonial
export async function GET(request) {
  try {
    await connectDB();
    
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

// POST - Create a new testimonial
export async function POST(request) {
  try {
    await connectDB();
    
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
    
    // Create new testimonial
    const testimonial = await Testimonial.create(body);
    
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

// PUT - Update a testimonial
export async function PUT(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      body,
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

// DELETE - Delete a testimonial
export async function DELETE(request) {
  try {
    await connectDB();
    
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
