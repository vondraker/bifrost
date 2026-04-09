import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Crown, Gem, Shield, Sparkles, Sword, Users, Zap } from 'lucide-react';
import SiteLayout from '../components/SiteLayout';
import { useI18n } from '../i18n-context';

const SERVER_HOST = 'bifrost.minecraft.best';

export default function HomePage() {
  const { t } = useI18n();
  const [onlinePlayers, setOnlinePlayers] = useState<number | null>(null);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadServerStatus = async () => {
      try {
        setIsLoadingPlayers(true);
        const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_HOST}`);
        if (!response.ok) {
          throw new Error(`Server status request failed: ${response.status}`);
        }

        const data: { online?: boolean; players?: { online?: number } } = await response.json();
        if (!isMounted) {
          return;
        }

        if (data.online && typeof data.players?.online === 'number') {
          setOnlinePlayers(data.players.online);
          return;
        }

        setOnlinePlayers(null);
      } catch {
        if (isMounted) {
          setOnlinePlayers(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPlayers(false);
        }
      }
    };

    void loadServerStatus();
    const intervalId = window.setInterval(() => {
      void loadServerStatus();
    }, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <SiteLayout>
      <main>
        <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <img
              src="/hero-end.png"
              alt="Bifrost End Dimension"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          </div>

          <StarField />

          <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

          <div className="relative z-10 mx-auto max-w-5xl px-4 pt-20 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              {t('home.seasonLive')}
            </div>

            <h1 className="font-[var(--font-orbitron)] mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span>{t('home.welcomeTo')}</span>
              <br />
              <span className="block mt-2 text-white">
                {t('home.title')}
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t('home.mission')}
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground animate-pulse-glow"
              >
                <Zap className="mr-2 h-5 w-5" />
                {t('home.getRank')}
              </Link>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(SERVER_HOST)}
                className="rounded-lg border border-border px-8 py-4 text-lg hover:bg-secondary"
              >
                {SERVER_HOST}
              </button>
            </div>

            <div className="mx-auto grid max-w-lg grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
                  <Users className="h-5 w-5 text-primary" />
                  5,000+
                </div>
                <div className="text-sm text-muted-foreground">{t('home.activePlayers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">99.9%</div>
                <div className="text-sm text-muted-foreground">{t('home.uptime')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">24/7</div>
                <div className="text-sm text-muted-foreground">{t('home.support')}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4" id="features">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
                <span className="text-sm font-medium text-primary">{t('home.whyChoose')}</span>
              </div>
              <h2 className="font-[var(--font-orbitron)] mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">{t('home.ultimateTitle')}</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {t('home.ultimateDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard icon={<Sword className="h-6 w-6 text-primary" />} title={t('home.feature1.title')} description={t('home.feature1.desc')} />
              <FeatureCard icon={<Shield className="h-6 w-6 text-primary" />} title={t('home.feature2.title')} description={t('home.feature2.desc')} />
              <FeatureCard icon={<Zap className="h-6 w-6 text-primary" />} title={t('home.feature3.title')} description={t('home.feature3.desc')} />
            </div>
          </div>
        </section>

        <section id="ranks" className="bg-card/50 py-24 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{t('home.premiumRanks')}</span>
              </div>
              <h2 className="font-[var(--font-orbitron)] mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">{t('home.elevate')}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <RankPreview name="VIP" price="$9.99" icon={<Sparkles className="h-6 w-6 text-white" />} color="from-emerald-500 to-emerald-600" />
              <RankPreview name="MVP" price="$24.99" icon={<Gem className="h-6 w-6 text-white" />} color="from-blue-500 to-cyan-500" />
              <RankPreview name="ELITE" price="$49.99" icon={<Crown className="h-6 w-6 text-white" />} color="from-primary to-accent" featured />
              <RankPreview name="LEGEND" price="$99.99" icon={<Sparkles className="h-6 w-6 text-white" />} color="from-amber-500 to-orange-500" />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="font-[var(--font-orbitron)] mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">{t('home.ready')}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {t('home.readyDesc')}
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card p-2 mb-8">
              <div className="rounded-lg bg-secondary px-4 py-2 text-left">
                <div className="font-mono text-lg">
                  {t('home.serverLabel')}: {SERVER_HOST}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t('home.playersOnline')}: {isLoadingPlayers ? t('home.loadingPlayers') : (onlinePlayers ?? t('home.playersUnavailable'))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/shop" className="inline-flex items-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground">
                <Zap className="mr-2 h-5 w-5" />
                {t('home.getRankNow')}
              </Link>
            </div>
          </div>
        </section>

        <div className="flex justify-center pb-8">
          <ChevronDown className="h-8 w-8 animate-bounce text-muted-foreground" />
        </div>
      </main>
    </SiteLayout>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <article className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/50">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">{icon}</div>
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}

function RankPreview({
  name,
  price,
  icon,
  color,
  featured = false,
}: {
  name: string;
  price: string;
  icon: ReactNode;
  color: string;
  featured?: boolean;
}) {
  const { t } = useI18n();

  return (
    <article className={`relative rounded-2xl border bg-card p-6 ${featured ? 'border-primary/50 scale-105' : 'border-border'}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-semibold text-primary-foreground">
          {t('home.mostPopular')}
        </div>
      )}
      <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 ${color}`}>
        {icon}
      </div>
      <h3 className="font-[var(--font-orbitron)] text-xl font-bold">{name}</h3>
      <p className="text-3xl font-bold">{price}</p>
      <p className="text-sm text-muted-foreground">{t('home.oneTime')}</p>
      <Link to="/shop" className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm">
        {t('home.getRankNamed').replace('{rank}', name)}
      </Link>
    </article>
  );
}

function StarField() {
  const stars = Array.from({ length: 45 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 53) % 100}%`,
    delay: `${((index * 17) % 30) / 10}s`,
    duration: `${2 + (((index * 29) % 30) / 10)}s`,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute h-1 w-1 rounded-full bg-primary/60 animate-star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}
