// backend/controllers/customizeController.js

const mongoose = require('mongoose');
const CustomizeRequest = require('../models/CustomizeRequest');

// ✅ Create a new custom tour request
exports.createRequest = async (req, res) => {
  try {
    const {
      name = 'Guest',
      phone = 'N/A',
      origin,
      destination,
      budget,
      days,
      vehicle,
      message = '',
    } = req.body;

    const request = new CustomizeRequest({
      name,
      phone,
      origin,
      destination,
      budget,
      days,
      vehicle,
      message,
      status: 'Pending',
    });

    await request.save();
    res.status(201).json({ message: '✅ Custom tour request received successfully.' });
  } catch (err) {
    console.error("❌ Error creating request:", err);
    res.status(500).json({ error: 'Failed to create request.' });
  }
};

// ✅ Get all custom requests (Admin view)
exports.getRequests = async (req, res) => {
  try {
    const requests = await CustomizeRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching requests:", err);
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
};

// ✅ Update request status (Approve / Reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const updated = await CustomizeRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    res.json({ message: '✅ Status updated successfully.', request: updated });
  } catch (err) {
    console.error("❌ Error updating request status:", err);
    res.status(500).json({ error: 'Failed to update request status.' });
  }
};

// ✅ Delete a request permanently (with ObjectId validation)
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid request ID.' });
    }

    const deleted = await CustomizeRequest.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    res.json({ message: '🗑️ Request deleted successfully.' });
  } catch (err) {
    console.error("❌ Error deleting request:", err);
    res.status(500).json({ error: 'Failed to delete request.' });
  }
};
