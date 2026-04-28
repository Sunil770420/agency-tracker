import GoogleAdEntry from '../models/GoogleAdEntry.js';

export const createGoogleEntry = async (req, res) => {
  try {
    const entry = await GoogleAdEntry.create({
      employee: req.user._id,
      campaignName: req.body.campaignName,
      date: req.body.date,
      spend: Number(req.body.spend || 0),
      conversions: Number(req.body.conversions || 0),
      ctr: Number(req.body.ctr || 0),
      costPerConversion: Number(req.body.costPerConversion || 0),
      clicks: Number(req.body.clicks || 0),
      impressions: Number(req.body.impressions || 0),
      notes: req.body.notes || ''
    });

    const populated = await GoogleAdEntry.findById(entry._id).populate(
      'employee',
      'name email team designation'
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error('CREATE GOOGLE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getGoogleEntries = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { employee: req.user._id };

    const entries = await GoogleAdEntry.find(filter)
      .populate('employee', 'name email team designation')
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (error) {
    console.error('GET GOOGLE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateGoogleEntry = async (req, res) => {
  try {
    const entry = await GoogleAdEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Google entry not found' });
    }

    if (
      req.user.role !== 'admin' &&
      entry.employee.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    entry.campaignName = req.body.campaignName ?? entry.campaignName;
    entry.date = req.body.date ?? entry.date;
    entry.spend = Number(req.body.spend ?? entry.spend);
    entry.conversions = Number(req.body.conversions ?? entry.conversions);
    entry.ctr = Number(req.body.ctr ?? entry.ctr);
    entry.costPerConversion = Number(
      req.body.costPerConversion ?? entry.costPerConversion
    );
    entry.clicks = Number(req.body.clicks ?? entry.clicks);
    entry.impressions = Number(req.body.impressions ?? entry.impressions);
    entry.notes = req.body.notes ?? entry.notes;

    const updated = await entry.save();
    const populated = await GoogleAdEntry.findById(updated._id).populate(
      'employee',
      'name email team designation'
    );

    res.json(populated);
  } catch (error) {
    console.error('UPDATE GOOGLE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteGoogleEntry = async (req, res) => {
  try {
    const entry = await GoogleAdEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Google entry not found' });
    }

    if (
      req.user.role !== 'admin' &&
      entry.employee.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await entry.deleteOne();
    res.json({ message: 'Google entry deleted successfully' });
  } catch (error) {
    console.error('DELETE GOOGLE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};