const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  year:    { type: Number, required: true },
  month:   { type: Number, required: true },  // 0 = January, 11 = December
  isPaid:  { type: Boolean, default: false },
  paidDate: { type: Date }
});

const BoarderSchema = new mongoose.Schema({
  boarderCode:   { type: String, unique: true },
  fullName:      { type: String, required: true },
  dateOfBirth:   { type: Date },
  nicPassport:   { type: String, required: true },
  email:         { type: String },
  contactNumber: { type: String, required: true },
  address:       { type: String },
  occupation:    { type: String },
  workAddress:   { type: String },
  boardInDate:   { type: Date, required: true },
  monthlyFee:    { type: Number, default: 0 },
  isActive:      { type: Boolean, default: true },
  payments:      [PaymentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Boarder', BoarderSchema);