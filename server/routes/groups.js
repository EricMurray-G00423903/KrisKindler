const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); // Import Group model

// Secret Santa assignment logic
const assignSecretSanta = (members) => {
    const names = members.map((member) => member.name); // Extract member names
    const shuffled = [...names];    // Copy the names array

    // Shuffle until no one is assigned to themselves
    let isValid = false;
    while (!isValid) {
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));  // Random index
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];    // Swap elements 
        }
        isValid = names.every((name, index) => name !== shuffled[index]);   // Check if no one is assigned to themselves
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

//Updated POST req to include/assign secret santa members
router.post('/', async (req, res) => {
    const { name, budget, members } = req.body;

    // Validate request body
    if (!name || !budget || !Array.isArray(members) || members.length < 3) {
        return res.status(400).json({ error: 'All fields are required, and there must be at least 3 members.' });
    }

    const membersWithWishlists = members.map((memberName) => ({
        name: memberName,
        wishlist: [],
    }));

    const membersWithAssignments = assignSecretSanta(membersWithWishlists); // Assign secret santas to members

    // Create a new group
    try {
        const newGroup = new Group({
            name,
            budget,
            members: membersWithAssignments,
        });

        const savedGroup = await newGroup.save();   // Save the group to MongoDB

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

// POST: Join a group by ID
router.post('/:groupId/join', async (req, res) => {
    const { groupId } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required.' });
    }

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found.' });
        }

        // Find the member in the group
        const member = group.members.find((member) => member.name === name);

        if (!member) {
            return res.status(400).json({ error: 'No such member in this group.' });
        }

        if (member.hasJoined) {
            return res.status(400).json({ error: 'You have already joined this group.' });
        }

        // Update hasJoined to true
        member.hasJoined = true;
        await group.save();

        // Respond with the assigned member and wishlist
        const assignedTo = group.members.find((m) => m.name === member.assignedTo);
        res.status(200).json({ message: 'Successfully joined the group.', assignedTo });
    } catch (err) {
        res.status(500).json({ error: 'Failed to join group', details: err.message });
    }
});
    

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