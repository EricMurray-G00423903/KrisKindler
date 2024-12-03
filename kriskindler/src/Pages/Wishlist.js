import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';

const Wishlist = () => {
    const [assignments, setAssignments] = useState([]);
    const [groups, setGroups] = useState([]);

    // Fetch assignments from localStorage
    useEffect(() => {
        const storedAssignments = JSON.parse(localStorage.getItem('assignments')) || {};
        setAssignments(storedAssignments);

        // Fetch group details for joined groups
        const fetchGroups = async () => {
            const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups')) || [];
            if (joinedGroups.length > 0) {
                try {
                    const response = await axios.post('http://localhost:4000/api/groups/filter', { groupIds: joinedGroups });
                    setGroups(response.data);
                } catch (error) {
                    console.error('Failed to fetch groups:', error);
                }
            }
        };

        fetchGroups();
    }, []);

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