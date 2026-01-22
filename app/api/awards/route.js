import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Award from '@/models/award.model';
import { verifyAdminToken } from '@/utils/authMiddleware';

// GET - Fetch all awards or a specific award
export async function GET(request) {
  try {
    await connectDB();
    
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
    
    await connectDB();
    
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
    
    // Create new award
    const award = await Award.create(body);
    
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
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Award ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const award = await Award.findByIdAndUpdate(
      id,
      body,
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
    
    await connectDB();
    
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
