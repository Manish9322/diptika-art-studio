import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema({
  instagram: {
    type: String,
    trim: true,
    default: ''
  },
  facebook: {
    type: String,
    trim: true,
    default: ''
  },
  twitter: {
    type: String,
    trim: true,
    default: ''
  },
  snapchat: {
    type: String,
    trim: true,
    default: ''
  },
  youtube: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  other: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false });

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    maxlength: [2000, 'Bio cannot exceed 2000 characters']
  },
  profileImage: {
    type: String,
    required: [true, 'Profile image is required'],
    default: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200'
  },
  aboutPageImage: {
    type: String,
    required: [true, 'About page image is required'],
    default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200'
  },
  image: {
    type: String,
    default: '' // Legacy field for backward compatibility
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  socialLinks: {
    type: socialLinksSchema,
    default: () => ({})
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true,
    default: '' // Optional - online platform only
  },
  mapLocation: {
    type: String,
    trim: true,
    default: '' // Optional - online platform only
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one active profile exists
profileSchema.pre('save', async function() {
  if (this.isNew || this.isModified('isActive')) {
    if (this.isActive) {
      // Deactivate all other profiles
      await mongoose.model('Profile').updateMany(
        { _id: { $ne: this._id } },
        { isActive: false }
      );
    }
  }
});

// Static method to get the active profile
profileSchema.statics.getActiveProfile = async function() {
  const profile = await this.findOne({ isActive: true });
  return profile;
};

// Delete any existing model to ensure fresh registration
if (mongoose.models.Profile) {
  delete mongoose.models.Profile;
}

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
