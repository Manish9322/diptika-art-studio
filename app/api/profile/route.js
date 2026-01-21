import { NextResponse } from 'next/server';
import _db from '../../../utils/db';
import Profile from '../../../models/profile.model';

// GET: Retrieve the active artist profile
export async function GET(request) {
  try {
    await _db();
    
    const profile = await Profile.getActiveProfile();
    
    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile._id,
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        profileImage: profile.profileImage || profile.image || '',
        aboutPageImage: profile.aboutPageImage || profile.image || '',
        image: profile.image || profile.profileImage || '', // Legacy field
        email: profile.email,
        phone: profile.phone || '',
        socialLinks: profile.socialLinks || [],
        experience: profile.experience,
        location: profile.location,
        mapLocation: profile.mapLocation || ''
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile', error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update the artist profile
export async function PUT(request) {
  try {
    await _db();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'title', 'bio', 'email', 'experience'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate social links structure
    if (body.socialLinks && Array.isArray(body.socialLinks)) {
      for (const link of body.socialLinks) {
        if (!link.platform || !link.url) {
          return NextResponse.json(
            { success: false, message: 'Each social link must have a platform and URL' },
            { status: 400 }
          );
        }
      }
    }

    // Get the active profile
    let profile = await Profile.findOne({ isActive: true });
    
    // If no profile exists, create a new one
    if (!profile) {
      profile = new Profile({
        ...body,
        isActive: true
      });
    } else {
      // Update existing profile
      profile.name = body.name;
      profile.title = body.title;
      profile.bio = body.bio;
      profile.profileImage = body.profileImage || body.image || profile.profileImage;
      profile.aboutPageImage = body.aboutPageImage || body.image || profile.aboutPageImage;
      profile.image = body.image || body.profileImage || profile.image; // Legacy field
      profile.email = body.email;
      profile.phone = body.phone || '';
      profile.socialLinks = body.socialLinks || [];
      profile.experience = body.experience;
      profile.location = body.location || '';
      profile.mapLocation = body.mapLocation || '';
    }

    await profile.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: profile._id,
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        profileImage: profile.profileImage || '',
        aboutPageImage: profile.aboutPageImage || '',
        image: profile.image || '',
        email: profile.email,
        phone: profile.phone || '',
        socialLinks: profile.socialLinks || [],
        experience: profile.experience,
        location: profile.location || '',
        mapLocation: profile.mapLocation || ''
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: messages },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update profile', error: error.message },
      { status: 500 }
    );
  }
}
