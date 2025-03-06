import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');

      const res = await fetch('https://s87-s89-hosted.onrender.com/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  // Check if user is logged in
const isLoggedIn = localStorage.getItem('token');
const username = localStorage.getItem('username'); // Get username
const email = localStorage.getItem('email'); // Get email

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Delete post handler
  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://s87-s89-hosted.onrender.com/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove deleted post from the state
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      {isLoggedIn && (
  <nav style={{ background: '#333', color: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
    <span>Logged in as: {username} ({email})</span>
    <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} 
      style={{ background: 'red', color: '#fff', border: 'none', padding: '5px 10px' }}>
      Logout
    </button>
  </nav>
)}

  <div className="home-container">

      <h1>Welcome to the Blog!</h1>

      {/* Show Add Post button if user is logged in */}
      {isLoggedIn && (
        <Link to="/create-post">
          <button>Add Post</button>
        </Link>
      )}

      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post._id}>
              <h2>
                <Link to={`/blog/${post._id}`}>{post.title}</Link>
              </h2>
              <p>By: {post.author.username}</p>
              <p>{post.content.substring(0, 100)}...</p>

              {/* Show delete button if the user is the post's author or an admin */}
              {isLoggedIn && (localStorage.getItem('userId') === post.author._id || localStorage.getItem('isAdmin') === 'true') && (
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              )}
            </li>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </ul>
    </div>
    </div>
  );
}

export default Home;
