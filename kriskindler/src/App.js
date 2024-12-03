import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // Import BrowserRouter, Routes, and Route from react-router-dom to route to different pages
import NavigationBar from './Components/NavigationBar'; // Import the NavigationBar component
import Home from './Pages/Home';  // Import the Home component
import Create from './Pages/Create';  // Import the Create component
import View from "./Pages/View";  // Import the View component
import Wishlist from "./Pages/Wishlist";  // Import the Wishlist component
import JoinGroup from "./Pages/JoinGroup";  // Import the JoinGroup component

// App component handles the routing for the application
function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/view" element={<View />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/join-group" element={<JoinGroup />} />
      </Routes>
    </Router>
  );
}

export default App;
