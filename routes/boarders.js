const express = require('express');
const router = express.Router();
const Boarder = require('../models/Boarder');

// GET — all active boarders
router.get('/', async (req, res) => {
  try {
    const boarders = await Boarder.find({ isActive: true });
    res.json(boarders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — Register a new boarder
router.post('/', async (req, res) => {
  try {
    const lastBoarder = await Boarder.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;
    if (lastBoarder && lastBoarder.boarderCode) {
      const lastNumber = parseInt(lastBoarder.boarderCode.replace('EL-', ''));
      nextNumber = lastNumber + 1;
    }
    const boarderCode = 'EL-' + String(nextNumber).padStart(4, '0');
    const boarder = new Boarder({ ...req.body, boarderCode });
    await boarder.save();
    res.json(boarder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT — Edit a boarder
router.put('/:id', async (req, res) => {
  try {
    const updated = await Boarder.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Remove (deactivate) a boarder
router.delete('/:id', async (req, res) => {
  try {
    await Boarder.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Boarder removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — Mark a monthly payment as paid (locked — cannot be reversed)
router.post('/:id/payments', async (req, res) => {
  try {
    const { year, month } = req.body;
    const boarder = await Boarder.findById(req.params.id);
    const existing = boarder.payments.find(
      p => p.year === year && p.month === month
    );
    if (existing) {
      if (existing.isPaid) {
        return res.json(boarder);
      }
      existing.isPaid = true;
      existing.paidDate = new Date();
    } else {
      boarder.payments.push({ year, month, isPaid: true, paidDate: new Date() });
    }
    await boarder.save();
    res.json(boarder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;