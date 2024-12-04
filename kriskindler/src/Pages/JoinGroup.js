import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinGroup = () => {
    const { groupId } = useParams(); // Extract groupId from the URL parameters
    const [name, setName] = useState('');   //useState hook to store the member name
    const [error, setError] = useState(''); // Error message state
    const [success, setSuccess] = useState(false); // Snackbar state
    const navigate = useNavigate(); // useNavigate hook for navigation

    const handleJoin = async () => {
        if (!name.trim()) {
            setError('Name is required.');  // Check if the name is empty
            return;
        }

        try {
            const response = await axios.post(`http://localhost:4000/api/groups/${groupId}/join`, { name });    // Send a POST request to the server

            // Update localStorage with assignments
            const assignments = JSON.parse(localStorage.getItem('assignments')) || {};  // Get assignments from localStorage
            assignments[groupId] = response.data.assignedTo; // Store the assigned member
            localStorage.setItem('assignments', JSON.stringify(assignments));   // Update localStorage

            // Add the group to joinedGroups
            const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups')) || [];
            if (!joinedGroups.includes(groupId)) {
                joinedGroups.push(groupId);
                localStorage.setItem('joinedGroups', JSON.stringify(joinedGroups));
            }

            // Store the current member for each group
            const currentMembers = JSON.parse(localStorage.getItem('currentMembers')) || {};
            currentMembers[groupId] = name;
            localStorage.setItem('currentMembers', JSON.stringify(currentMembers));

            // Navigate to the wishlist page
            navigate('/wishlist');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to join group.');   // Handle any errors
        }
    };

    // Below is the code for the UI of the JoinGroup component using Material-UI
    return (
        <Box sx={{ maxWidth: 500, margin: '2rem auto' }}>
            <Card sx={{ boxShadow: 3, padding: '1rem', borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ marginBottom: '1rem', textAlign: 'center', color: '#2e7d32', fontFamily: 'Roboto Slab' }}>
                        Join Group
                    </Typography>
                    <TextField
                        fullWidth
                        label="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!error}
                        helperText={error}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleJoin}
                        fullWidth
                        disabled={success}
                        sx={{ padding: '0.75rem', fontWeight: 'bold' }}
                    >
                        {success ? 'Joining...' : 'Join Group'}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default JoinGroup;
