const express = require('express');
const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit new inquiry (public route)
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      whatsappNumber,
      productId,
      message,
      rentalDuration,
      location
    } = req.body;

    // Validate required fields
    if (!customerName || !email || !phone || !whatsappNumber || !productId || !rentalDuration || !location) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const inquiry = new Inquiry({
      customerName,
      email,
      phone,
      whatsappNumber,
      productId,
      productName: product.name,
      message,
      rentalDuration,
      location
    });

    await inquiry.save();
    
    res.status(201).json({ 
      message: 'Inquiry submitted successfully! We will contact you soon.',
      inquiry: {
        id: inquiry._id,
        customerName: inquiry.customerName,
        productName: inquiry.productName,
        createdAt: inquiry.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
});

// Get all inquiries (protected route - admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }

    const inquiries = await Inquiry.find(filter)
      .populate('productId', 'name category images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inquiry.countDocuments(filter);

    res.json({
      inquiries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
});

// Get single inquiry (protected route - admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('productId', 'name category images description');
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiry', error: error.message });
  }
});

// Update inquiry status (protected route - admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'contacted', 'converted', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('productId', 'name category');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry status updated successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inquiry status', error: error.message });
  }
});

// Get inquiry statistics (protected route - admin only)
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const contactedInquiries = await Inquiry.countDocuments({ status: 'contacted' });
    const convertedInquiries = await Inquiry.countDocuments({ status: 'converted' });
    const closedInquiries = await Inquiry.countDocuments({ status: 'closed' });

    // Get inquiries from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentInquiries = await Inquiry.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      total: totalInquiries,
      new: newInquiries,
      contacted: contactedInquiries,
      converted: convertedInquiries,
      closed: closedInquiries,
      recentInquiries
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiry statistics', error: error.message });
  }
});

// Delete inquiry (protected route - admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
});

module.exports = router;
