import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#2e7d32', top: 'auto', bottom: 0 }}>
            <Toolbar sx={{ justifyContent: 'center', flexDirection: 'column', padding: 1 }}>
                <Typography variant="body2" color="inherit" sx={{ fontFamily: 'Roboto Slab' }}>
                    © {new Date().getFullYear()} KrisKindler. All rights reserved.
                </Typography>
                <Typography variant="body2" color="inherit" sx={{ fontFamily: 'Roboto Slab' }}>
                    <Link href="https://github.com/EricMurray-G00423903/KrisKindler" color="inherit" underline="hover">
                        Github
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;