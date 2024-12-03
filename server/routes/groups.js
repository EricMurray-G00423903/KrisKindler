const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); // Import Group model

// GET: Retrieve all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find(); // Fetch all groups from MongoDB
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

// POST: Create a new group
router.post('/', async (req, res) => {
    const { name, budget, members } = req.body;

    // Basic validation
    if (!name || !budget || !Array.isArray(members) || members.length < 1) {
        return res.status(400).json({ error: 'All fields are required and members must be a non-empty array' });
    }

    // Initialize members with wishlists
    const membersWithWishlists = members.map((memberName) => ({
        name: memberName,
        wishlist: [],
    }));

    try {
        const newGroup = new Group({
            name,
            budget,
            members: membersWithWishlists,
        });

        const savedGroup = await newGroup.save(); // Save to MongoDB
        res.status(201).json(savedGroup);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create group' });
    }
});

// PUT: Update a member's wishlist
router.put('/:groupId/members/:memberId/wishlist', async (req, res) => {
    const { groupId, memberId } = req.params;
    const { wishlist } = req.body;

    try {
        const group = await Group.findById(groupId);
        const member = group.members.id(memberId);
        member.wishlist = wishlist;
        await group.save();

        res.status(200).json(group);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update wishlist' });
    }
});

// DELETE: Delete a group by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedGroup = await Group.findByIdAndDelete(id); // Delete the group from MongoDB
        if (!deletedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully', deletedGroup });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete group', details: err.message });
    }
});

module.exports = router;