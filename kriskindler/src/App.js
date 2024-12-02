import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from './Components/NavigationBar';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<h1>Welcome to KrisKindler</h1>} />
        <Route path="/about" element={<h1>About Us</h1>} />
        <Route path="/contact" element={<h1>Contact Us</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
