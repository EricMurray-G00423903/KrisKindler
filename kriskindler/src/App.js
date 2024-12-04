import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar'; // Include the NavigationBar UI component
// Import the pages
import Home from './Pages/Home';
import Create from './Pages/Create';
import JoinGroup from './Pages/JoinGroup';
import View from './Pages/View';
import Wishlist from './Pages/Wishlist';

// App component with routing, The NavigationBar is displayed on all pages
const App = () => {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/view" element={<View />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/join/:groupId" element={<JoinGroup />} />
            </Routes>
        </Router>
    );
};

export default App;
