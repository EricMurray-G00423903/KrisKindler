import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Create = () => {
    const [groupName, setGroupName] = useState(''); //useState hook to store the group name
    const [budget, setBudget] = useState('');   //useState hook to store the budget
    const [members, setMembers] = useState(['']); // Dynamic list of member names
    const [errors, setErrors] = useState({}); // Validation errors

    // Handle adding a new member input field
    const handleAddMember = () => {
        setMembers([...members, '']);
    };

    // Handle removing a member input field
    const handleRemoveMember = (index) => {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
    };

    // Handle input changes for member names
    const handleMemberChange = (index, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = value;
        setMembers(updatedMembers);
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


    // Handle form submission - replace with axios after
    const handleSubmit = (event) => {
        event.preventDefault();     // prevent default form submission
        if (validateForm()) {
            console.log({ groupName, budget, members });
            alert('Group Created Successfully!');   //integrate a modal/toast for user feedback later
            setGroupName('');
            setBudget('');
            setMembers(['']);
            setErrors({});
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center', color: '#2e7d32' }}>
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
                <Button variant="contained" color="success" type="submit" fullWidth>
                    Create Group
                </Button>
            </form>
        </Box>
    );
};

export default Create;  // Export the Create component to be used in App.js