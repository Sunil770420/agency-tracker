import MetaAdEntry from '../models/MetaAdEntry.js';

export const createMetaEntry = async (req, res) => {
  try {
    const entry = await MetaAdEntry.create({
      employee: req.user._id,
      campaignName: req.body.campaignName,
      date: req.body.date,
      spend: Number(req.body.spend || 0),
      cpp: Number(req.body.cpp || 0),
      cpl: Number(req.body.cpl || 0),
      results: Number(req.body.results || 0),
      roas: Number(req.body.roas || 0),
      roi: Number(req.body.roi || 0),
      notes: req.body.notes || ''
    });

    const populated = await MetaAdEntry.findById(entry._id).populate(
      'employee',
      'name email team designation'
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error('CREATE META ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMetaEntries = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { employee: req.user._id };

    const entries = await MetaAdEntry.find(filter)
      .populate('employee', 'name email team designation')
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (error) {
    console.error('GET META ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMetaEntry = async (req, res) => {
  try {
    const entry = await MetaAdEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Meta entry not found' });
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
    entry.cpp = Number(req.body.cpp ?? entry.cpp);
    entry.cpl = Number(req.body.cpl ?? entry.cpl);
    entry.results = Number(req.body.results ?? entry.results);
    entry.roas = Number(req.body.roas ?? entry.roas);
    entry.roi = Number(req.body.roi ?? entry.roi);
    entry.notes = req.body.notes ?? entry.notes;

    const updated = await entry.save();
    const populated = await MetaAdEntry.findById(updated._id).populate(
      'employee',
      'name email team designation'
    );

    res.json(populated);
  } catch (error) {
    console.error('UPDATE META ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteMetaEntry = async (req, res) => {
  try {
    const entry = await MetaAdEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Meta entry not found' });
    }

    if (
      req.user.role !== 'admin' &&
      entry.employee.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await entry.deleteOne();
    res.json({ message: 'Meta entry deleted successfully' });
  } catch (error) {
    console.error('DELETE META ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};