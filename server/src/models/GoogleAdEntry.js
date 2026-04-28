import mongoose from 'mongoose';

const googleAdEntrySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaignName: { type: String, required: true },
    date: { type: Date, required: true },
    spend: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    costPerConversion: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('GoogleAdEntry', googleAdEntrySchema);