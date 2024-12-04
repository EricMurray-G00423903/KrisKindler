const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); // Import Group model

// Secret Santa assignment logic
const assignSecretSanta = (members) => {
    const names = members.map((member) => member.name); // Extract member names
    const shuffled = [...names]; // Copy the names array

    // Shuffle until no one is assigned to themselves
    let isValid = false;
    while (!isValid) {
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Random index
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
        isValid = names.every((name, index) => name !== shuffled[index]); // Check if no one is assigned to themselves
    }

    return members.map((member, index) => ({
        ...member,
        assignedTo: shuffled[index],
    }));
};

// GET: Retrieve all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find(); // Fetch all groups from MongoDB
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

// POST: Create a new group and assign Secret Santa
router.post('/', async (req, res) => {
    const { name, budget, members } = req.body;

    // Validate request body
    if (!name || !budget || !Array.isArray(members) || members.length < 3) {
        return res.status(400).json({ error: 'All fields are required, and there must be at least 3 members.' });
    }

    const membersWithWishlists = members.map((memberName) => ({
        name: memberName,
        wishlist: [],
        hasJoined: false,
    }));

    const membersWithAssignments = assignSecretSanta(membersWithWishlists); // Assign Secret Santa

    try {
        const newGroup = new Group({
            name,
            budget,
            members: membersWithAssignments,
            owner: members[0], // Set the first member as the group owner
        });

        const savedGroup = await newGroup.save(); // Save to MongoDB

        // Create the join link
        const joinLink = `http://localhost:3000/join/${savedGroup._id}`;

        res.status(201).json({ group: savedGroup, joinLink });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create group', details: err.message });
    }
});

// PUT: Update a member's wishlist
router.put('/:groupId/members/:memberId/wishlist', async (req, res) => {
    const { groupId, memberId } = req.params;
    const { wishlist } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const member = group.members.find((m) => m.name === memberId);
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        member.wishlist = wishlist;
        await group.save();

        res.status(200).json(group);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update wishlist', details: err.message });
    }
});

// PUT: Update group name and budget
router.put('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { name, budget, owner } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if the owner matches the stored owner name
        if (group.owner !== owner) {
            return res.status(403).json({ error: 'Only the owner can update the group' });
        }

        group.name = name;
        group.budget = budget;
        await group.save();

        res.status(200).json({ message: 'Group updated successfully', group });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update group', details: err.message });
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

// POST: Join a group by ID
router.post('/:groupId/join', async (req, res) => {
    const { groupId } = req.params; // Extract group ID from the request parameters
    const { name } = req.body;     // Extract name from the request body

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required.' });
    }

    try {
        // Find the group in the database
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found.' });
        }

        // Find the member in the group by name
        const member = group.members.find((member) => member.name.toLowerCase() === name.toLowerCase());

        if (!member) {
            return res.status(400).json({ error: `No member named "${name}" found in this group.` });
        }

        // Check if the member has already joined the group
        if (member.hasJoined) {
            return res.status(400).json({ error: `The member "${name}" has already joined this group.` });
        }

        // Mark the member as having joined
        member.hasJoined = true;

        // Save the updated group to the database
        await group.save();

        // Retrieve the member they were assigned to (Secret Santa)
        const assignedTo = group.members.find((m) => m.name === member.assignedTo);

        // Respond with success, including their assigned member's details
        res.status(200).json({
            message: `Successfully joined the group as "${name}".`,
            assignedTo: assignedTo || { name: 'No assignment yet', wishlist: [] }
        });
    } catch (err) {
        // Handle any unexpected errors
        res.status(500).json({ error: 'Failed to join group', details: err.message });
    }
});


// POST: Filter groups by IDs
router.post('/filter', async (req, res) => {
    const { groupIds } = req.body;

    if (!Array.isArray(groupIds) || groupIds.length === 0) {
        return res.status(400).json({ error: 'Invalid group IDs.' });
    }

    try {
        const groups = await Group.find({ _id: { $in: groupIds } });
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch groups', details: err.message });
    }
});

module.exports = router;
