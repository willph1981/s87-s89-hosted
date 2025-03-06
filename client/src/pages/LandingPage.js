import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      <h1>Welcome to the Blog</h1>
      <p>Join us to create and explore amazing posts.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
}

export default LandingPage;
