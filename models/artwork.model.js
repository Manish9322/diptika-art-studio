import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Artwork title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  medium: {
    type: String,
    trim: true,
    default: 'Mixed Media'
  },
  context: {
    type: String,
    trim: true,
    default: 'Personal'
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  price: {
    type: String,
    trim: true,
    default: ''
  },
  currency: {
    type: String,
    trim: true,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP', 'AED']
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
artworkSchema.index({ title: 1 });
artworkSchema.index({ category: 1 });
artworkSchema.index({ active: 1, order: 1 });
artworkSchema.index({ featured: 1 });

const Artwork = mongoose.models.Artwork || mongoose.model('Artwork', artworkSchema);

export default Artwork;
