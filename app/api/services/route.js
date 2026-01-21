import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Service from '@/models/service.model';

// GET - Fetch all services with optional filters
export async function GET(request) {
  try {
    await connectDB();
    
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

// POST - Create a new service
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.priceStart) {
      return NextResponse.json({
        success: false,
        message: 'Please provide all required fields: title, description, priceStart'
      }, { status: 400 });
    }
    
    // Create service
    const service = await Service.create(body);
    
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

// PUT - Update a service
export async function PUT(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Service ID is required'
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Find and update service
    const service = await Service.findByIdAndUpdate(
      id,
      body,
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

// DELETE - Delete a service
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Service ID is required'
      }, { status: 400 });
    }
    
    // Find and delete service
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return NextResponse.json({
        success: false,
        message: 'Service not found'
      }, { status: 404 });
    }
    
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
