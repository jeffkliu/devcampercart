const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    course: {
      type: Object,
      required: [true, 'Please add course'],
    },
    totalCost: {
      type: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Cart', CartSchema);
