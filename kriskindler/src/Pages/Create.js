import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation after group creation
import axios from 'axios'; // Import axios for API calls

const Create = () => {
    const [groupName, setGroupName] = useState(''); //useState hook to store the group name
    const [budget, setBudget] = useState('');   //useState hook to store the budget
    const [members, setMembers] = useState(['']); // Dynamic list of member names
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
    const [errors, setErrors] = useState({}); // Validation errors
    const [isSubmitting, setIsSubmitting] = useState(false); // Form submission state stop people spamming POST requests
    const navigate = useNavigate(); // useNavigate hook for navigation after group creation

    // Handle adding a new member input field
    const handleAddMember = () => {
        setMembers([...members, '']);   // Add a new empty member input field
    };

    // Handle removing a member input field
    const handleRemoveMember = (index) => {
        const updatedMembers = members.filter((_, i) => i !== index);   // This code removes the member at the specified index
        setMembers(updatedMembers); // Update the members state
    };

    // Handle input changes for member names
    const handleMemberChange = (index, value) => {
        const updatedMembers = [...members];    // Copy the current members array
        updatedMembers[index] = value;  // Update the member name at the specified index
        setMembers(updatedMembers); // Update the members state
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!groupName.trim()) newErrors.groupName = 'Group name is required';  // Check if group name is empty
        if (!budget || isNaN(budget) || budget <= 0) newErrors.budget = 'Budget must be a positive number'; // Check if budget is a positive number
        if (members.some((member) => !member.trim())) {
            newErrors.members = 'All member names are required';    // Check if all member names are empty
        } else if (members.length < 3) {
            newErrors.members = 'A group must have at least 3 members'; // Check if the group has less than 3 members
        }
        setErrors(newErrors);   // add errors to the state
        return Object.keys(newErrors).length === 0; // return true if there are no errors
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true); // Disable the button
            try {
                // Make a POST request to create a new group
                const response = await axios.post('http://localhost:4000/api/groups', {
                    name: groupName,
                    budget: parseFloat(budget),
                    members: members,
                });
    
                // Extract the join link from the response
                const { joinLink } = response.data;
                const groupId = joinLink.split('/').pop(); // Extract group ID from the join link
    
                // Show success feedback and navigate to the Join Group page
                setOpenSnackbar(true);
                setTimeout(() => navigate(`/join/${groupId}`), 2000);   // Redirect to the join page after 2 seconds
            } catch (error) {
                console.error('Failed to create group:', error.response?.data || error.message);
                setErrors({ form: 'Failed to create group. Please try again.' });   // Show an error message
                setIsSubmitting(false); // Re-enable the button if the request fails 
            }
        }
    };
    
    

    // Close Snackbar
     const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Create the form using material-ui
    return (
        <Box sx={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center', color: '#2e7d32', fontFamily: 'Roboto Slab' }}>
                Create Group
            </Typography>
            <form onSubmit={handleSubmit}>
                {/* Group Name */}
                <TextField
                    fullWidth
                    label="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    error={!!errors.groupName}
                    helperText={errors.groupName}
                    sx={{ marginBottom: '1rem' }}
                />

                {/* Budget */}
                <TextField
                    fullWidth
                    label="Budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    error={!!errors.budget}
                    helperText={errors.budget}
                    sx={{ marginBottom: '1rem' }}
                />

                {/* Members */}
                <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>Members</Typography>
                {members.map((member, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <TextField
                            fullWidth
                            label={`Member ${index + 1}`}
                            value={member}
                            onChange={(e) => handleMemberChange(index, e.target.value)}
                            sx={{ marginRight: '0.5rem' }}
                        />
                        <IconButton color="error" onClick={() => handleRemoveMember(index)} disabled={members.length === 1}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                ))}
                {errors.members && (
                    <Typography variant="body2" color="error" sx={{ marginBottom: '1rem' }}>
                        {errors.members}
                    </Typography>
                )}
                <Button variant="outlined" color="success" onClick={handleAddMember} startIcon={<AddIcon />} sx={{ marginBottom: '1rem' }}>
                    Add Member
                </Button>

                {/* Submit Button */}
                <Button variant="contained" color="success" type="submit" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Create Group'}
                </Button>
            </form>
            {/* Snackbar for Success Feedback */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000} // Closes automatically after 3 seconds
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Group created successfully! Redirecting...
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Create;  // Export the Create component to be used in App.js