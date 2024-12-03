import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinGroup = () => {
    const [searchParams] = useSearchParams();
    const joinLink = searchParams.get('joinLink'); // Extract joinLink
    const groupId = joinLink.split('/').pop(); // Extract groupId from the joinLink
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // Snackbar state
    const navigate = useNavigate();

    const handleJoin = async () => {
        if (!name.trim()) {
            setError('Name is required.');
            return;
        }

        try {
            // Send request to join the group
            const response = await axios.post(`http://localhost:4000/api/groups/${groupId}/join`, { name });

            // Store group ID in localStorage
            const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups')) || [];
            if (!joinedGroups.includes(groupId)) {
                joinedGroups.push(groupId);
                localStorage.setItem('joinedGroups', JSON.stringify(joinedGroups));
            }

            // Show success snackbar and redirect to /wishlist
            const { assignedTo } = response.data;
            setSuccess(true);
            setTimeout(() => navigate('/wishlist', { state: { assignedTo } }), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to join group.');
        }
    };

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
