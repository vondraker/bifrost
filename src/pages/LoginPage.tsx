import { useEffect, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from '@react-oauth/google';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchSessionUser, getErrorMessage, loginWithGoogleCredential, type User } from '../lib/api';
import { useI18n } from '../i18n-context';
import InlineAlert from '../components/ui/InlineAlert';
import BrandMark from '../components/shared/BrandMark';

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionUser = await fetchSessionUser();
        setUser(sessionUser);
      } catch (sessionError) {
        console.error(sessionError);
      } finally {
        setCheckingSession(false);
      }
    };

    void loadSession();
  }, []);

  const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();
  const isGoogleConfigured = googleClientId.length > 0;

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const { credential } = credentialResponse;
      if (!credential) {
        setError(t('login.noCredential'));
        return;
      }

      const loggedInUser = await loginWithGoogleCredential(credential);
      setUser(loggedInUser);
      setError(null);
      navigate('/profile');
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    }
  };

  if (checkingSession) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
          <p className="text-muted-foreground">{t('login.checkingSession')}</p>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/hero-end.png"
          alt="Bifrost world background"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/55 to-background/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,70,220,0.28),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-black/65 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-6 flex items-center justify-center gap-3">
            <BrandMark size="sm" className="gap-3" />
          </div>

          <h1 className="font-[var(--font-orbitron)] mb-2 text-center text-2xl font-bold">{t('login.welcomeBack')}</h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">{t('login.subtitle')}</p>

          <form className="space-y-3">
            <input
              type="email"
              disabled
              placeholder={t('login.email')}
              className="h-11 w-full rounded-md border border-primary/60 bg-background/35 px-3 text-sm text-foreground placeholder:text-muted-foreground/90"
            />
            <input
              type="password"
              disabled
              placeholder={t('login.password')}
              className="h-11 w-full rounded-md border border-border bg-background/35 px-3 text-sm text-foreground placeholder:text-muted-foreground/90"
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" disabled className="h-4 w-4 rounded border-border bg-background/60" />
              {t('login.remember')}
            </label>

            <div className="rounded-md border border-border bg-background/25 p-3 text-sm text-muted-foreground">
              {t('login.humanCheck')}
            </div>

            <button
              type="button"
              disabled
              className="h-11 w-full rounded-md bg-secondary text-sm font-semibold text-foreground/90 opacity-90"
            >
              {t('login.signIn')}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground/90">
            <span className="h-px flex-1 bg-border" />
            {t('login.orContinue')}
            <span className="h-px flex-1 bg-border" />
          </div>

          {isGoogleConfigured ? (
            <div className="space-y-2">
              <GoogleOAuthProvider clientId={googleClientId}>
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => setError(t('login.failed'))} />
              </GoogleOAuthProvider>
              <p className="text-center text-xs text-muted-foreground">{t('login.useGooglePrompt')}</p>
            </div>
          ) : (
            <InlineAlert>{t('login.googleNotConfigured')}</InlineAlert>
          )}

          {error && <InlineAlert className="mt-4">{error}</InlineAlert>}

          <button
            type="button"
            onClick={() => setError(t('login.resetUnavailable'))}
            className="mt-4 block w-full text-center text-sm text-primary hover:text-primary/80"
          >
            {t('login.forgotPassword')}
          </button>
        </div>
      </div>
    </main>
  );
}
