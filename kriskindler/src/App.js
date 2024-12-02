import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<h1>Welcome to KrisKindler</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
