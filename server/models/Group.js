const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Member name
    wishlist: { type: [String], default: [] }, // Wishlist items
    assignedTo: { type: String, default: null }, // The person this member is assigned to
});


const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    members: [
        {
            name: { type: String, required: true },
            wishlist: { type: [String], default: [] },
            assignedTo: { type: String, default: null }, // For Secret Santa
            hasJoined: { type: Boolean, default: false }, // Tracks whether the member has joined
        },
    ],
});


const Group = mongoose.model('Group', groupSchema);

module.exports = Group;