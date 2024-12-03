import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const ViewGroups = () => {
    const [groups, setGroups] = useState([]);
    const [expandedGroup, setExpandedGroup] = useState(null); // Track which group is expanded

    const fetchGroups = async () => {
        try {
            const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups')) || [];
            const response = await axios.post(`http://localhost:4000/api/groups/filter`, { groupIds: joinedGroups });
            setGroups(response.data);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleCopy = (joinLink) => {
        navigator.clipboard.writeText(joinLink);
        alert('Link copied to clipboard!');
    };

    const toggleExpand = (groupId) => {
        setExpandedGroup(expandedGroup === groupId ? null : groupId); // Toggle the expanded group
    };

    return (
        <Box sx={{ padding: '2rem' }}>
            <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center', fontFamily: 'Roboto Slab', color: '#2e7d32', fontWeight: 'bold' }}>
                Your Groups
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {groups.map((group) => (
                    <Card key={group._id} sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Roboto Slab' }}>
                                {group.name}
                                <IconButton onClick={() => toggleExpand(group._id)}>
                                    <ExpandMoreIcon />
                                </IconButton>
                            </Typography>
                            <Collapse in={expandedGroup === group._id}>
                                <Typography variant="body2" sx={{ margin: '0.5rem 0' }}>
                                    Budget: €{group.budget}
                                </Typography>
                                <Typography variant="body2" sx={{ marginBottom: '1rem' }}>
                                    Members: {group.members.length}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleCopy(`http://localhost:3000/join/${group._id}`)}
                                >
                                    Copy Join Link
                                </Button>
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default ViewGroups;
