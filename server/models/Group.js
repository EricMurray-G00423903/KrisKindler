const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    wishlist: { type: [String], default: [] }, // Array of strings for wishlist items
});

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    members: [memberSchema], // Embedding members within the group
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;