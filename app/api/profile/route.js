import { NextResponse } from 'next/server';
import _db from '../../../utils/db';
import Profile from '../../../models/profile.model';
import { uploadSingleImage, uploadBase64Image } from '../../../utils/cloudinary';

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
    
    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    
    let name, title, bio, email, phone, experience, location, mapLocation, socialLinks;
    let profileImageUrl, aboutPageImageUrl;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with image uploads)
      const formData = await request.formData();
      
      // Extract form fields
      name = formData.get('name');
      title = formData.get('title');
      bio = formData.get('bio');
      email = formData.get('email');
      phone = formData.get('phone') || '';
      experience = formData.get('experience');
      location = formData.get('location') || '';
      mapLocation = formData.get('mapLocation') || '';
      const socialLinksJson = formData.get('socialLinks');
      const existingProfileImage = formData.get('existingProfileImage');
      const existingAboutPageImage = formData.get('existingAboutPageImage');
      
      // Parse social links
      socialLinks = {};
      if (socialLinksJson) {
        try {
          socialLinks = JSON.parse(socialLinksJson);
        } catch (e) {
          return NextResponse.json(
            { success: false, message: 'Invalid social links format' },
            { status: 400 }
          );
        }
      }
      
      // Initialize image URLs with existing values or defaults
      profileImageUrl = existingProfileImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200';
      aboutPageImageUrl = existingAboutPageImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200';
      
      // Handle profile image upload
      const profileImageFile = formData.get('profileImage');
      if (profileImageFile && profileImageFile.name) {
        const buffer = Buffer.from(await profileImageFile.arrayBuffer());
        const uploadedImage = await uploadSingleImage(buffer, profileImageFile.type, 'profile');
        profileImageUrl = uploadedImage.url;
      }
      
      // Handle about page image upload
      const aboutPageImageFile = formData.get('aboutPageImage');
      if (aboutPageImageFile && aboutPageImageFile.name) {
        const buffer = Buffer.from(await aboutPageImageFile.arrayBuffer());
        const uploadedImage = await uploadSingleImage(buffer, aboutPageImageFile.type, 'profile');
        aboutPageImageUrl = uploadedImage.url;
      }
    } else {
      // Handle JSON (backward compatibility - check if images need uploading)
      const body = await request.json();
      name = body.name;
      title = body.title;
      bio = body.bio;
      email = body.email;
      phone = body.phone || '';
      experience = body.experience;
      location = body.location || '';
      mapLocation = body.mapLocation || '';
      socialLinks = body.socialLinks || {};
      
      // Handle profile image
      profileImageUrl = body.profileImage || body.image;
      if (profileImageUrl && (profileImageUrl.startsWith('data:') || profileImageUrl.length > 500) && !profileImageUrl.startsWith('http')) {
        const uploaded = await uploadBase64Image(profileImageUrl, 'profile');
        profileImageUrl = uploaded.url;
      } else if (!profileImageUrl || !profileImageUrl.startsWith('http')) {
        profileImageUrl = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200';
      }
      
      // Handle about page image
      aboutPageImageUrl = body.aboutPageImage || body.image;
      if (aboutPageImageUrl && (aboutPageImageUrl.startsWith('data:') || aboutPageImageUrl.length > 500) && !aboutPageImageUrl.startsWith('http')) {
        const uploaded = await uploadBase64Image(aboutPageImageUrl, 'profile');
        aboutPageImageUrl = uploaded.url;
      } else if (!aboutPageImageUrl || !aboutPageImageUrl.startsWith('http')) {
        aboutPageImageUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200';
      }
    }
    
    // Validate required fields
    if (!name || !title || !bio || !email || !experience) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, title, bio, email, experience' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get the active profile
    let profile = await Profile.findOne({ isActive: true });
    
    // If no profile exists, create a new one
    if (!profile) {
      profile = new Profile({
        name,
        title,
        bio,
        profileImage: profileImageUrl,
        aboutPageImage: aboutPageImageUrl,
        image: profileImageUrl, // Legacy field
        email,
        phone,
        socialLinks,
        experience,
        location,
        mapLocation,
        isActive: true
      });
    } else {
      // Update existing profile
      profile.name = name;
      profile.title = title;
      profile.bio = bio;
      profile.profileImage = profileImageUrl;
      profile.aboutPageImage = aboutPageImageUrl;
      profile.image = profileImageUrl; // Legacy field
      profile.email = email;
      profile.phone = phone;
      profile.socialLinks = socialLinks;
      profile.experience = experience;
      profile.location = location;
      profile.mapLocation = mapLocation;
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
        socialLinks: profile.socialLinks || {},
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
