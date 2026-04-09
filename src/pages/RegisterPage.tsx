import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import SiteLayout from '../components/SiteLayout';
import { useI18n } from '../i18n-context';

const passwordRules = [
  { id: 'length', labelKey: 'register.req.length', test: (value: string) => value.length >= 8 },
  { id: 'upper', labelKey: 'register.req.upper', test: (value: string) => /[A-Z]/.test(value) },
  { id: 'lower', labelKey: 'register.req.lower', test: (value: string) => /[a-z]/.test(value) },
  { id: 'number', labelKey: 'register.req.number', test: (value: string) => /\d/.test(value) },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  const passwordStrength = useMemo(
    () => passwordRules.filter((rule) => rule.test(formData.password)).length,
    [formData.password],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.username || !formData.email || !formData.password) {
      setError(t('register.error.fill'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.error.match'));
      return;
    }
    if (passwordStrength < 4) {
      setError(t('register.error.requirements'));
      return;
    }
    if (!formData.agreeToTerms) {
      setError(t('register.error.terms'));
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    navigate('/login');
  };

  return (
    <SiteLayout>
      <main className="min-h-screen bg-background flex">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mXHqYyP9BmaHjUDL1slSDdDy7jHa7l.png"
            alt="Bifrost Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
          <section className="w-full max-w-xl mx-auto rounded-2xl border border-border bg-card/60 p-8">
            <h1 className="mb-2 font-[var(--font-orbitron)] text-3xl font-bold">{t('register.title')}</h1>
            <p className="mb-6 text-muted-foreground">{t('register.subtitle')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label={t('register.username')}
                value={formData.username}
                onChange={(value) => setFormData((previous) => ({ ...previous, username: value }))}
              />
              <InputField
                label={t('register.email')}
                type="email"
                value={formData.email}
                onChange={(value) => setFormData((previous) => ({ ...previous, email: value }))}
              />
              <InputField
                label={t('register.password')}
                type="password"
                value={formData.password}
                onChange={(value) => setFormData((previous) => ({ ...previous, password: value }))}
              />
              <InputField
                label={t('register.confirmPassword')}
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => setFormData((previous) => ({ ...previous, confirmPassword: value }))}
              />

              <div className="rounded-lg border border-border p-3 text-sm">
                <p className="mb-2 font-medium">{t('register.passwordReqTitle')}</p>
                <ul className="space-y-1 text-muted-foreground">
                  {passwordRules.map((rule) => (
                    <li key={rule.id} className={rule.test(formData.password) ? 'text-green-400' : ''}>
                      {t(rule.labelKey)}
                    </li>
                  ))}
                </ul>
              </div>

              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      agreeToTerms: event.target.checked,
                    }))
                  }
                  className="mt-1"
                />
                {t('register.terms')}
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground disabled:opacity-60"
              >
                {isLoading ? t('register.creating') : t('register.create')}
              </button>
            </form>

            {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

            <p className="mt-5 text-sm text-muted-foreground">
              {t('register.already')}{' '}
              <Link to="/login" className="text-primary">
                {t('register.signIn')}
              </Link>
            </p>
          </section>
        </div>
      </main>
    </SiteLayout>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none ring-primary/40 focus:ring-2"
      />
    </label>
  );
}
