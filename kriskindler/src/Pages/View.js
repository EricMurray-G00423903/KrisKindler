import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';

const View = () => {
    const [groups, setGroups] = useState([]);   // Initialize groups state
    const currentUser = localStorage.getItem('currentMember'); // Get current member from localStorage
    const currentMembers = JSON.parse(localStorage.getItem('currentMembers')) || {}; // Get current members from localStorage

    // useEffect hook to fetch groups from the server when the component loads
    useEffect(() => {
        const fetchGroups = async () => {
            const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups')) || [];    // Get joined groups from localStorage
            if (joinedGroups.length > 0) {
                try {
                    // Very similar code to other components
                    const response = await axios.post('http://localhost:4000/api/groups/filter', { groupIds: joinedGroups });
                    setGroups(response.data);
                } catch (error) {
                    console.error('Failed to fetch groups:', error);    // Log any errors to the console
                }
            }
        };

        fetchGroups();  // Call the fetchGroups function
    }, []);

    const handleCopyInviteLink = (groupId) => {
        const inviteLink = `http://localhost:3000/join/${groupId}`;
        navigator.clipboard.writeText(inviteLink).then(() => {
            alert('Invite link copied to clipboard!');  // Show an alert when the link is copied, uses the Clipboard API
        }).catch((err) => {
            console.error('Failed to copy invite link:', err);
        });
    };

    const handleEdit = (group) => {
        const newName = prompt('Enter new group name:', group.name);    // Prompt the user for a new group name
        const newBudget = prompt('Enter new budget:', group.budget);    // Prompt the user for a new budget

        if (newName && newBudget) {
            axios.put(`http://localhost:4000/api/groups/${group._id}`, {    // Very similar to the POST request in the server
                name: newName,
                budget: parseFloat(newBudget),
                owner: currentMembers[group._id], // Pass the correct owner name
            })
            .then(() => {
                alert('Group updated successfully!');
                window.location.reload(); // Reload to show updated data
            })
            .catch((err) => alert(err.response?.data?.error || 'Failed to update group.'));
        }
    };

    // Function to handle deleting a group
    const handleDelete = (groupId) => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            axios.delete(`http://localhost:4000/api/groups/${groupId}`, {
                data: { owner: currentUser },
            })
            .then(() => {
                alert('Group deleted successfully!');   // Show an alert when the group is deleted
                window.location.reload(); // Reload to show updated data
            })
            .catch((err) => alert(err.response?.data?.error || 'Failed to delete group.'));
        }
    };

    // this renders the component using material ui
    return (
        <Box sx={{ maxWidth: 800, margin: '2rem auto', textAlign: 'center' }}>
            <Typography variant="h4" sx={{ marginBottom: '2rem' }}>
                Your Groups
            </Typography>

            {groups.map((group) => (
                <Card key={group._id} sx={{ marginBottom: '1rem', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6">{group.name}</Typography>
                        <Typography variant="body2">Budget: €{group.budget}</Typography>
                        <Typography variant="body2">Members: {group.members.length}</Typography>

                        <Box sx={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleCopyInviteLink(group._id)}
                            >
                                Copy Invite Link
                            </Button>
                            {group.owner === currentMembers[group._id] && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={() => handleEdit(group)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(group._id)}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default View;