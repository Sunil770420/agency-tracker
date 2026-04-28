import mongoose from 'mongoose';

const metaAdEntrySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaignName: { type: String, required: true },
    date: { type: Date, required: true },
    spend: { type: Number, default: 0 },
    cpp: { type: Number, default: 0 },
    cpl: { type: Number, default: 0 },
    results: { type: Number, default: 0 },
    roas: { type: Number, default: 0 },
    roi: { type: Number, default: 0 },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('MetaAdEntry', metaAdEntrySchema);