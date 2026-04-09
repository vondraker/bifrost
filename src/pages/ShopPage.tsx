import { useMemo, useState } from 'react';
import { Crown, Gem, Search, Sparkles, Star } from 'lucide-react';
import SiteLayout from '../components/SiteLayout';
import { useI18n } from '../i18n-context';

const ranks = [
  {
    id: 'vip',
    name: 'VIP',
    price: 9.99,
    descriptionKey: 'shop.rank.vip',
    icon: Star,
    badge: 'from-emerald-500 to-emerald-400',
  },
  {
    id: 'mvp',
    name: 'MVP',
    price: 24.99,
    descriptionKey: 'shop.rank.mvp',
    icon: Gem,
    badge: 'from-sky-500 to-blue-500',
  },
  {
    id: 'elite',
    name: 'ELITE',
    price: 49.99,
    descriptionKey: 'shop.rank.elite',
    icon: Crown,
    badge: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'legend',
    name: 'LEGEND',
    price: 99.99,
    descriptionKey: 'shop.rank.legend',
    icon: Sparkles,
    badge: 'from-amber-500 to-orange-500',
  },
];

export default function ShopPage() {
  const [query, setQuery] = useState('');
  const [selectedRankId, setSelectedRankId] = useState('elite');
  const [username, setUsername] = useState('');
  const { t } = useI18n();

  const selectedRank = useMemo(
    () => ranks.find((rank) => rank.id === selectedRankId) ?? ranks[0],
    [selectedRankId],
  );

  const filteredRanks = useMemo(
    () => ranks.filter((rank) => rank.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <SiteLayout>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t('shop.officialStore')}</span>
          </div>
          <h1 className="font-[var(--font-orbitron)] text-4xl sm:text-5xl font-bold">{t('shop.chooseRank')}</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {t('shop.subtitle')}
          </p>
        </section>

        <div className="mx-auto mb-6 max-w-md">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('shop.searchPlaceholder')}
              className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 outline-none ring-primary/40 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_330px]">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredRanks.map((rank) => (
              <button
                key={rank.id}
                type="button"
                onClick={() => setSelectedRankId(rank.id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  selectedRankId === rank.id
                    ? 'border-primary/50 bg-card shadow-xl shadow-primary/20 scale-[1.02]'
                    : 'border-border bg-card/70 hover:bg-card hover:scale-[1.01]'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className={`inline-flex rounded-lg bg-gradient-to-r p-2 ${rank.badge}`}>
                    <rank.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-bold">${rank.price.toFixed(2)}</p>
                </div>
                <h2 className="font-[var(--font-orbitron)] text-lg font-semibold">{rank.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t(rank.descriptionKey)}</p>
              </button>
            ))}
          </section>

          <aside className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-[var(--font-orbitron)] mb-1 text-lg font-semibold">{t('shop.cart')}</h3>
            <p className="text-sm text-muted-foreground">{t('shop.selectedRank')}: {selectedRank.name}</p>
            <p className="mb-4 mt-2 text-3xl font-bold">${selectedRank.price.toFixed(2)}</p>

            <label className="block text-sm">
              <span className="mb-1 block text-muted-foreground">{t('shop.minecraftUsername')}</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={t('shop.usernamePlaceholder')}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none ring-primary/40 focus:ring-2"
              />
            </label>

            <button
              type="button"
              disabled={!username.trim()}
              className="mt-4 h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground disabled:opacity-60"
            >
              {t('shop.checkout')}
            </button>
          </aside>
        </div>

        <section className="py-16 mt-8 rounded-2xl bg-card/40 border border-border">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="font-[var(--font-orbitron)] text-2xl font-bold mb-4">{t('shop.guaranteeTitle')}</h2>
            <p className="text-muted-foreground">
              {t('shop.guaranteeText')}
            </p>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
