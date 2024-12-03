const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Member name
    wishlist: { type: [String], default: [] }, // Wishlist items
    assignedTo: { type: String, default: null }, // The person this member is assigned to
});


const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    members: [memberSchema], // Embedding members within the group
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;