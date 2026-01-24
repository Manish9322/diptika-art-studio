// Test Cloudinary connection
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
  try {
    console.log('🔍 Testing Cloudinary Connection...\n');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');
    console.log('\n📁 Fetching resources from "services" folder...\n');

    // List all images in the services folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'services/',
      max_results: 10,
    });

    if (result.resources.length === 0) {
      console.log('❌ No images found in "services" folder');
    } else {
      console.log(`✅ Found ${result.resources.length} image(s):\n`);
      result.resources.forEach((resource, index) => {
        console.log(`${index + 1}. Public ID: ${resource.public_id}`);
        console.log(`   URL: ${resource.secure_url}`);
        console.log(`   Created: ${resource.created_at}\n`);
      });
    }

    // Try to search for the specific image
    console.log('\n🔎 Searching for image: image-1d56cad0f9b6\n');
    try {
      const specificImage = await cloudinary.api.resource('services/image-1d56cad0f9b6');
      console.log('✅ Image found!');
      console.log('URL:', specificImage.secure_url);
      console.log('Format:', specificImage.format);
      console.log('Size:', specificImage.bytes, 'bytes');
    } catch (err) {
      console.log('❌ Image not found:', err.error?.message || err.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.error?.message || error.message);
    
    if (error.error?.http_code === 401) {
      console.log('\n⚠️  Authentication failed. Please check your API credentials in .env file');
    }
  }
}

testCloudinary();
