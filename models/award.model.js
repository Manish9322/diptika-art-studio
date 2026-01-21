import mongoose from 'mongoose';

const awardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Award title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  organization: {
    type: String,
    required: [true, 'Awarding organization is required'],
    trim: true,
    maxlength: [150, 'Organization name cannot exceed 150 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  category: {
    type: String,
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters'],
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  certificateUrl: {
    type: String,
    default: ''
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
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
awardSchema.index({ title: 1 });
awardSchema.index({ active: 1, order: 1 });
awardSchema.index({ featured: 1 });
awardSchema.index({ year: -1 });

const Award = mongoose.models.Award || mongoose.model('Award', awardSchema);

export default Award;
