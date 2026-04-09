export interface User {
  email: string;
  name: string;
  picture?: string;
}

export interface MinecraftProfile {
  username: string;
  uuid: string;
  skinUrl: string;
}

const API_BASE_URL = 'http://localhost:3000';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error';
};

export const fetchSessionUser = async (): Promise<User | null> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { user: User };
  return data.user;
};

export const loginWithGoogleCredential = async (credential: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ credential }),
  });

  const data = (await response.json()) as { message?: string; user?: User };

  if (!response.ok || !data.user) {
    throw new Error(data.message ?? 'Login failed');
  }

  return data.user;
};

export const fetchMinecraftProfile = async (minecraftUsername: string): Promise<MinecraftProfile> => {
  const response = await fetch(`${API_BASE_URL}/api/minecraft/profile/${minecraftUsername}`);

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message ?? 'Failed to fetch Minecraft profile');
  }

  const profileData = (await response.json()) as MinecraftProfile;
  return profileData;
};
