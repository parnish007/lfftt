const Tour = require('../models/Tour');
const Vehicle = require('../models/Vehicle');

exports.updateAvailability = async (req, res) => {
  const { type, id } = req.params;
  const { availableDates } = req.body;

  try {
    const model = type === 'tour' ? Tour : Vehicle;
    const record = await model.findByIdAndUpdate(id, { availableDates }, { new: true });
    res.json(record);
  } catch {
    res.status(400).json({ error: 'Failed to update availability' });
  }
};

exports.getAvailability = async (req, res) => {
  const { type, id } = req.params;
  try {
    const model = type === 'tour' ? Tour : Vehicle;
    const record = await model.findById(id);
    res.json(record.availableDates);
  } catch {
    res.status(400).json({ error: 'Could not fetch availability' });
  }
};
