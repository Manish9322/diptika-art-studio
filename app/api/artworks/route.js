import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Artwork from '@/models/artwork.model';

// GET - Fetch all artworks with optional filters
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
    
    // Build query
    let query = { active: true };
    
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

// POST - Create a new artwork
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.category || !body.images || !body.description || !body.date) {
      return NextResponse.json({
        success: false,
        message: 'Please provide all required fields: title, category, images, description, date'
      }, { status: 400 });
    }
    
    // Create artwork
    const artwork = await Artwork.create(body);
    
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

// PUT - Update an artwork
export async function PUT(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Artwork ID is required'
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    const artwork = await Artwork.findByIdAndUpdate(
      id,
      body,
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

// DELETE - Delete an artwork
export async function DELETE(request) {
  try {
    await connectDB();
    
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
