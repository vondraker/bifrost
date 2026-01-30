import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import './App.css';


interface User {
  email: string;
  name: string;
  picture?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.log('No active session');
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const { credential } = credentialResponse;

      if (!credential) {
        setError('No credential received from Google');
        return;
      }

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for setting the cookie
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      setError(null);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    // In a real app, you might also want to call a logout endpoint to clear the cookie
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app-container">
        {user ? (
          <div className="welcome-message">
            <h1>Bienvenido, {user.email}</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="login-container">
            <h1>Sign in to Bifrost</h1>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => setError('Login Failed')}
            />
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
