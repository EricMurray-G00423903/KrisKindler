import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const Wishlist = () => {

    // useState hook to store the assignments
    const [assignments, setAssignments] = useState({}); // Store who is assigned to who
    const [groups, setGroups] = useState([]);   // Store the groups
    const [wishlists, setWishlists] = useState({}); // Store the wishlists
    const currentMembers = JSON.parse(localStorage.getItem('currentMembers')) || {};    // Get current members from localStorage || who you joined as

    useEffect(() => {
        // Retrieve assignments from localStorage
        const storedAssignments = JSON.parse(localStorage.getItem('assignments')) || {};
        setAssignments(storedAssignments);

        // Fetch joined group details from the backend
        const fetchGroups = async () => {
            // Get joined groups from localStorage
            const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups')) || [];

            // if there are joined groups
            if (joinedGroups.length > 0) {

                try {

                    const response = await axios.post('http://localhost:4000/api/groups/filter', { groupIds: joinedGroups });  // Fetch groups from the backend
                    setGroups(response.data);   // Set the groups

                    // Initialize wishlists with current data
                    const initialWishlists = {};
                    // Loop through the groups
                    response.data.forEach((group) => {
                        const member = group.members.find((m) => m.name === currentMembers[group._id]); // Find the member
                        if (member) {
                            initialWishlists[group._id] = member.wishlist;
                        }
                    });
                    setWishlists(initialWishlists); // Set the wishlists

                } catch (error) {
                    console.error('Failed to fetch groups:', error); // Log error
                }
            }
        };

        fetchGroups();
    }, []);

    // useEffect is a hook that runs after the first render and every time the component updates
    useEffect(() => {
        // Fetch updated assignments periodically
        const fetchAssignments = async () => {

            const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups')) || [];    // Get joined groups from localStorage

            // if there are joined groups
            if (joinedGroups.length > 0) {

                try {

                    const response = await axios.post('http://localhost:4000/api/groups/filter', { groupIds: joinedGroups });   // Fetch groups from the backend
                    const updatedAssignments = {};  // Initialize updated assignments
                    response.data.forEach((group) => {  // Loop through the groups
                        const assignedMember = group.members.find((m) => m.name === assignments[group._id]?.name);
                        if (assignedMember) {   // if assigned member is found
                            updatedAssignments[group._id] = {   // Update the assignments
                                ...assignments[group._id],  // Spread the current assignments
                                wishlist: assignedMember.wishlist,  // Update the wishlist
                            };
                        }
                    });
                    setAssignments(updatedAssignments);  // Set the updated assignments
                    localStorage.setItem('assignments', JSON.stringify(updatedAssignments));    // Store the updated assignments in localStorage

                } catch (error) {
                    console.error('Failed to fetch assignments:', error);   // Log error
                }
            }
        };

        const intervalId = setInterval(fetchAssignments, 5000); // Fetch every 5 seconds
        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [assignments]);

    // Function to add a wishlist item
    const handleAddWishlistItem = (groupId) => {
        setWishlists((prevWishlists) => ({
            ...prevWishlists,
            [groupId]: [...(prevWishlists[groupId] || []), ''],
        }));
    };

    // Function to remove a wishlist item
    const handleRemoveWishlistItem = (groupId, index) => {
        setWishlists((prevWishlists) => ({
            ...prevWishlists,
            [groupId]: prevWishlists[groupId].filter((_, i) => i !== index),
        }));
    };

    // Function to handle wishlist changes
    const handleWishlistChange = (groupId, index, value) => {
        setWishlists((prevWishlists) => ({
            ...prevWishlists,
            [groupId]: prevWishlists[groupId].map((item, i) => (i === index ? value : item)),
        }));
    };

    // Function to update the wishlist
    const handleUpdateWishlist = async (groupId) => {
        const memberId = currentMembers[groupId];
        const wishlist = wishlists[groupId] || [];

        // Validate wishlist items
        if (wishlist.some((item) => !item.trim())) {
            alert('Wishlist items cannot be empty.');
            return;
        }

        try {
            await axios.put(`http://localhost:4000/api/groups/${groupId}/members/${memberId}/wishlist`, { wishlist });  // Update the wishlist

            // Fetch updated assignments from the backend
            const response = await axios.post('http://localhost:4000/api/groups/filter', { groupIds: [groupId] });
            const updatedGroup = response.data[0];  // Get the updated group
            const updatedAssignments = { ...assignments };  // Spread the current assignments
            const assignedMember = updatedGroup.members.find((m) => m.name === assignments[groupId].name);  // Find the assigned member
            if (assignedMember) {
                updatedAssignments[groupId].wishlist = assignedMember.wishlist; // Update the wishlist
            }
            localStorage.setItem('assignments', JSON.stringify(updatedAssignments));    // Store the updated assignments in localStorage
            setAssignments(updatedAssignments); // Set the updated assignments

            alert('Wishlist updated successfully!');    // Show success message
        } catch (error) {
            console.error('Failed to update wishlist:', error);
            alert('Failed to update wishlist.');
        }
    };

    // Below is the code for the Wishlist component, using Material-UI components
    return (
        <Box sx={{ maxWidth: 800, margin: '2rem auto', textAlign: 'center' }}>
            <Typography variant="h4" sx={{ marginBottom: '2rem', color: '#2e7d32', fontFamily: 'Roboto Slab', fontWeight: 'bold' }}>
                Your Secret Santa Assignments
            </Typography>

            {groups.length > 0 ? (
                groups.map((group) => (
                    <Card key={group._id} sx={{ marginBottom: '1rem', boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{group.name}</Typography>
                            <Typography variant="body2" sx={{ marginBottom: '1rem' }}>
                                Budget: €{group.budget}
                            </Typography>
                            {assignments[group._id] ? (
                                <>
                                    <Typography variant="body1">
                                        Assigned to: {assignments[group._id].name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Wishlist: {assignments[group._id].wishlist.length > 0
                                            ? assignments[group._id].wishlist.join(', ')
                                            : 'No items yet.'}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    You haven’t joined this group yet.
                                </Typography>
                            )}

                            {/* Wishlist Form */}
                            <Typography variant="h6" sx={{ marginTop: '1rem' }}>Your Wishlist</Typography>
                            {(wishlists[group._id] || []).map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <TextField
                                        fullWidth
                                        label={`Item ${index + 1}`}
                                        value={item}
                                        onChange={(e) => handleWishlistChange(group._id, index, e.target.value)}
                                        sx={{ marginRight: '0.5rem' }}
                                    />
                                    <IconButton color="error" onClick={() => handleRemoveWishlistItem(group._id, index)}>
                                        <RemoveIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button variant="outlined" color="success" onClick={() => handleAddWishlistItem(group._id)} startIcon={<AddIcon />} sx={{ marginBottom: '1rem' }}>
                                Add Item
                            </Button>
                            <Button variant="contained" color="success" onClick={() => handleUpdateWishlist(group._id)} fullWidth>
                                Update Wishlist
                            </Button>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No groups found. Join or create a group to see your assignments!
                </Typography>
            )}
        </Box>
    );
};

export default Wishlist;