import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import GiftIcon from '@mui/icons-material/CardGiftcard';
import { NavLink } from 'react-router-dom';

const NavigationBar = () => {
    const navStyles = {
        textDecoration: 'none',
        color: 'white',
        marginLeft: 20,
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}> {/* Dark green */}
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <GiftIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Roboto Slab' }}>
                    KrisKindler
                </Typography>
                <NavLink to="/" style={navStyles}>
                    <Button color="inherit">Home</Button>
                </NavLink>
                <NavLink to="/create" style={navStyles}>
                    <Button color="inherit">Create Group</Button>
                </NavLink>
                <NavLink to="/view" style={navStyles}>
                    <Button color="inherit">View Group</Button>
                </NavLink>
                <NavLink to="/wishlist" style={navStyles}>
                    <Button color="inherit">Wishlist</Button>
                </NavLink>
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;