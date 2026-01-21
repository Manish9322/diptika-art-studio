import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Contact from '@/models/contact.model';

// GET - Fetch all contact requests
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    
    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Execute query
    let contactsQuery = Contact.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      contactsQuery = contactsQuery.limit(parseInt(limit));
    }
    
    const contacts = await contactsQuery.exec();
    
    // Transform data to match frontend interface
    const formattedContacts = contacts.map(contact => ({
      id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      service: contact.service,
      eventDate: contact.eventDate,
      message: contact.message,
      timestamp: contact.createdAt.toISOString(),
      status: contact.status
    }));
    
    return NextResponse.json({
      success: true,
      count: formattedContacts.length,
      data: formattedContacts
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch contact requests'
    }, { status: 500 });
  }
}

// POST - Create new contact request
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const { name, email, phone, service, eventDate, message } = body;
    
    if (!name || !email || !phone || !service || !eventDate || !message) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }
    
    // Create new contact
    const contact = await Contact.create({
      name,
      email,
      phone,
      service,
      eventDate,
      message,
      status: 'new'
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        service: contact.service,
        eventDate: contact.eventDate,
        message: contact.message,
        timestamp: contact.createdAt.toISOString(),
        status: contact.status
      },
      message: 'Contact request submitted successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to submit contact request'
    }, { status: 500 });
  }
}

// PATCH - Update contact request status
export async function PATCH(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({
        success: false,
        error: 'Contact ID and status are required'
      }, { status: 400 });
    }
    
    if (!['new', 'read', 'archived'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status value'
      }, { status: 400 });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Contact request not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: contact._id.toString(),
        status: contact.status
      },
      message: 'Contact status updated successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update contact request'
    }, { status: 500 });
  }
}

// DELETE - Delete contact request
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Contact ID is required'
      }, { status: 400 });
    }
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Contact request not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contact request deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete contact request'
    }, { status: 500 });
  }
}
