import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Blog from './pages/Blog';
import { UserProvider } from './context/UserContext';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token'); // Check if user is logged in

  return (
    <UserProvider>
    
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
      </Routes>
   
    </UserProvider>
  );
}

export default App;
