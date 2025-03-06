import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('https://s87-s89-hosted.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('isAdmin', data.isAdmin);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);
      alert('Login successful!');

      // Force a re-render by using `window.location.reload()`
      navigate('/'); // Navigate to home first
      window.location.reload(); // Reload to reflect the authentication change
    } else {
      alert(data.message || 'Login failed!');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
