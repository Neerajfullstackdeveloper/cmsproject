import express from 'express';
import Client from '../models/Client.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all clients (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // Build filter
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    // Search by employee name or company name
    if (search) {
      filter.$or = [
        { employeeName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const clients = await Client.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get client submissions by current employee
router.get('/my-submissions', authenticate, authorize('employee'), async (req, res) => {
  try {
    const clients = await Client.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit new client data (employee only)
router.post('/', authenticate, authorize('employee'), async (req, res) => {
  try {
    const {
      employeePaymentName,
      clientName,
      companyName,
      mobileNumber,
      paymentReceivedDate,
      amount,
      gstNumber,
      email,
      serviceName,
      serviceType,
      paymentType,
      tenureStartDate,
      tenureEndDate,
      imageBase64,
    } = req.body;
    
    const newClient = new Client({
      employeePaymentName,
      clientName,
      companyName,
      mobileNumber,
      paymentReceivedDate,
      amount,
      employeeId: req.user.id,
      employeeName: req.user.name,
      gstNumber,
      email,
      serviceName,
      serviceType,
      paymentType,
      tenureStartDate: tenureStartDate ? new Date(tenureStartDate) : undefined,
      tenureEndDate: tenureEndDate ? new Date(tenureEndDate) : undefined,
      imageBase64,
      status: 'pending'
    });
    
    await newClient.save();
    
    res.status(201).json({ success: true, data: newClient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update client status (admin only)
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client submission not found' });
    }
    
    client.status = status;
    client.updatedAt = Date.now();
    
    await client.save();
    
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get client by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client submission not found' });
    }
    
    // Check if user is admin or the employee who created the submission
    if (req.user.role !== 'admin' && client.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this record' });
    }
    
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
