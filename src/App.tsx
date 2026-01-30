import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import './App.css';


interface User {
  email: string;
  name: string;
  picture?: string;
}

interface MinecraftProfile {
  username: string;
  uuid: string;
  skinUrl: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [minecraftUsername, setMinecraftUsername] = useState<string>('');
  const [minecraftProfile, setMinecraftProfile] = useState<MinecraftProfile | null>(null);
  const [minecraftError, setMinecraftError] = useState<string | null>(null);
  const [loadingMinecraft, setLoadingMinecraft] = useState<boolean>(false);

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
    setMinecraftProfile(null);
    setMinecraftUsername('');
    // In a real app, you might also want to call a logout endpoint to clear the cookie
  };

  const handleMinecraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMinecraftError(null);
    setLoadingMinecraft(true);

    try {
      // Call our backend API instead of Mojang directly (to avoid CORS issues)
      const response = await fetch(`http://localhost:3000/api/minecraft/profile/${minecraftUsername}`);

      if (!response.ok) {
        const errorData = await response.json();
        setMinecraftError(errorData.message || "Failed to fetch Minecraft profile");
        setLoadingMinecraft(false);
        return;
      }

      const profileData = await response.json();

      setMinecraftProfile({
        username: profileData.username,
        uuid: profileData.uuid,
        skinUrl: profileData.skinUrl
      });
      setMinecraftError(null);
    } catch (err: any) {
      console.error('Minecraft API error:', err);
      setMinecraftError(err.message || 'Failed to fetch Minecraft profile');
    } finally {
      setLoadingMinecraft(false);
    }
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app-container">
        {user ? (
          <div className="welcome-message">
            <h1>Bienvenido, {user.email}</h1>

            {!minecraftProfile ? (
              <div className="minecraft-form">
                <h2>Enter your Minecraft Username</h2>
                <form onSubmit={handleMinecraftSubmit}>
                  <input
                    type="text"
                    value={minecraftUsername}
                    onChange={(e) => setMinecraftUsername(e.target.value)}
                    placeholder="Minecraft username"
                    required
                    disabled={loadingMinecraft}
                  />
                  <button type="submit" disabled={loadingMinecraft}>
                    {loadingMinecraft ? 'Loading...' : 'Submit'}
                  </button>
                </form>
                {minecraftError && <p className="error">{minecraftError}</p>}
              </div>
            ) : (
              <div className="minecraft-profile">
                <h2>Minecraft Profile</h2>
                <div className="skin-display">
                  <img src={minecraftProfile.skinUrl} alt={`${minecraftProfile.username}'s skin`} />
                  <span className="fire-emoji">🔥</span>
                </div>
                <p className="username">{minecraftProfile.username}</p>
                <button onClick={() => setMinecraftProfile(null)}>Change Username</button>
              </div>
            )}

            <button onClick={handleLogout} className="logout-btn">Logout</button>
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
