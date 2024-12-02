import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material'; // Importing Material-UI components
import { NavLink } from 'react-router-dom'; // Importing NavLink from react-router-dom to create links for routing
import Card from '@mui/material/Card';  // Importing Card from Material-UI for creating a card
import CardContent from '@mui/material/CardContent';    // Importing CardContent from Material-UI for creating content inside the card

// Home component
const Home = () => {
    // Styling for the links
    const linkStyles = {
        textDecoration: 'none', // Remove underline from the link
        margin: '10px', // Add margin around the link
    };

    /*
    * The Home component contains the following sections:	
    * 1. Welcome Section: Displays a welcome message to the user.
    * 2. Quick Links: Contains buttons to navigate to different sections of the application.
    * 3. How It Works Section: Provides a brief overview of how the application works.
    * 4. The Home component uses Material-UI components like Typography, Button, Container, Box, Card, and CardContent to structure the content on the page.
    * 5. The NavLink component from react-router-dom is used to create links for navigation.
    * 6. The linkStyles object contains styling properties for the links
    * 7. The Home component is exported to be used in the App component
    */
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '2rem' }}>
            {/* Welcome Section */}
            <Typography variant="h3" sx={{ color: '#2e7d32', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'Roboto Slab' }}>
                Welcome to KrisKindler!
            </Typography>
            <Typography variant="h6" sx={{ color: '#4caf50', marginBottom: '2rem' }}>
                Organize your Secret Santa with ease.
            </Typography>

            {/* Quick Links */}
            <Box>
                <NavLink to="/create" style={linkStyles}>
                    <Button variant="contained" color="success">Create Group</Button>
                </NavLink>
                <NavLink to="/view" style={linkStyles}>
                    <Button variant="contained" color="info">View Group</Button>
                </NavLink>
                <NavLink to="/wishlist" style={linkStyles}>
                    <Button variant="contained" color="warning">Wishlist</Button>
                </NavLink>
            </Box>

            {/* How It Works Section in a Card */}
            <Card sx={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f5f5f5', boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold', marginBottom: '1rem' }}>
                        How It Works
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
                        1. Create a Group for your Secret Santa exchange.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
                        2. Add your group members, set a budget and share the link.
                    </Typography>
                    <Typography variant="body1">
                        3. KrisKindler will do the magic behind the scenes!
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Home; // Export the Home component to be used in App.js
