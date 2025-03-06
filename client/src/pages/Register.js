import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // To redirect to the login page after successful registration

  const handleRegister = async (e) => {
    e.preventDefault();

    // Create the request body
    const userData = { username, email, password };

    // Send POST request to the backend
    const res = await fetch('https://s87-s89-hosted.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      // Redirect to login page after successful registration
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } else {
      setError(data.message || 'Registration failed!');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h1>Register</h1>
      
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {error && <p>{error}</p>}

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
