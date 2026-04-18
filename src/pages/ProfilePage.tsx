import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import { fetchMinecraftProfile, fetchSessionUser, getErrorMessage, type MinecraftProfile, type User } from '../lib/api';
import { useI18n } from '../i18n-context';
import InlineAlert from '../components/ui/InlineAlert';
import PrimaryButton from '../components/ui/PrimaryButton';
import SurfaceCard from '../components/ui/SurfaceCard';
import TextField from '../components/ui/TextField';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [minecraftProfile, setMinecraftProfile] = useState<MinecraftProfile | null>(null);
  const [loadingMinecraft, setLoadingMinecraft] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionUser = await fetchSessionUser();
        setUser(sessionUser);
      } catch (sessionError) {
        setError(getErrorMessage(sessionError));
      } finally {
        setLoadingUser(false);
      }
    };

    void loadSession();
  }, []);

  const initials = useMemo(() => {
    if (!user?.email) {
      return 'BF';
    }
    return user.email.slice(0, 2).toUpperCase();
  }, [user?.email]);

  const handleMinecraftSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoadingMinecraft(true);

    try {
      const profile = await fetchMinecraftProfile(minecraftUsername);
      setMinecraftProfile(profile);
    } catch (minecraftError) {
      setError(getErrorMessage(minecraftError));
    } finally {
      setLoadingMinecraft(false);
    }
  };

  if (loadingUser) {
    return (
      <SiteLayout>
        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4">
          <p className="text-muted-foreground">{t('profile.loading')}</p>
        </main>
      </SiteLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SiteLayout>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="relative mb-8">
          <div className="h-48 rounded-2xl overflow-hidden relative">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mXHqYyP9BmaHjUDL1slSDdDy7jHa7l.png"
              alt="Profile Banner"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
          <div className="relative -mt-20 px-6 flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-32 h-32 rounded-2xl border-4 border-background bg-card flex items-center justify-center font-[var(--font-orbitron)] text-3xl">
              {initials}
            </div>
            <div>
              <h1 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold">{user.email}</h1>
              <p className="text-sm text-muted-foreground">{t('profile.signedInGoogle')}</p>
            </div>
          </div>
        </section>

        <SurfaceCard as="section" className="mb-6 p-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-[var(--font-orbitron)] text-xl font-semibold">{t('profile.welcome')}</h2>
              <p className="text-sm text-muted-foreground">{t('profile.linkAccount')}</p>
            </div>
          </div>
        </SurfaceCard>

        {!minecraftProfile ? (
          <SurfaceCard as="section" className="p-6">
            <h2 className="font-[var(--font-orbitron)] mb-2 text-xl font-semibold">{t('profile.linkUsername')}</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('profile.fetchDesc')}
            </p>

            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleMinecraftSubmit}>
              <TextField
                className="flex-1"
                value={minecraftUsername}
                onChange={setMinecraftUsername}
                placeholder={t('profile.usernamePlaceholder')}
                required
              />
              <PrimaryButton
                type="submit"
                disabled={loadingMinecraft}
              >
                {loadingMinecraft ? t('profile.loadingButton') : t('profile.fetchButton')}
              </PrimaryButton>
            </form>
          </SurfaceCard>
        ) : (
          <SurfaceCard as="section" className="p-6">
            <h2 className="font-[var(--font-orbitron)] mb-4 text-xl font-semibold">{t('profile.minecraftProfile')}</h2>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img
                src={minecraftProfile.skinUrl}
                alt={`${minecraftProfile.username} skin`}
                className="h-28 w-28 rounded-lg border border-border object-cover"
              />
              <div>
                <p className="text-2xl font-bold">{minecraftProfile.username}</p>
                <p className="text-sm text-muted-foreground">{t('profile.uuid')}: {minecraftProfile.uuid}</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 rounded-lg border border-border px-4 py-2 hover:bg-secondary"
              onClick={() => setMinecraftProfile(null)}
            >
              {t('profile.changeUsername')}
            </button>
          </SurfaceCard>
        )}

        {error && <InlineAlert className="mt-4">{error}</InlineAlert>}
      </main>
    </SiteLayout>
  );
}
