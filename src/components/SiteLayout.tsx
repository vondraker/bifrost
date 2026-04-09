import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import { useI18n } from '../i18n-context';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'border-b border-border bg-background/92 backdrop-blur-xl' : 'border-b border-border/50 bg-background/82 backdrop-blur-md'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link to="/" className="group flex items-center gap-3">
              <span className="relative h-8 w-8 transition-transform group-hover:scale-110">
                <img
                  src="/tree-icon.png"
                  alt="Bifrost tree icon"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="logo-wordmark text-[2rem] leading-none transition-transform group-hover:scale-105">
                BIFRÖST
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.home')}</Link>
              <Link to="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.store')}</Link>
              <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.features')}</a>
              <a href="/#ranks" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.ranks')}</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/shop" className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                <User className="h-4 w-4" />
                {t('nav.login')}
              </Link>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as 'es' | 'en')}
                className="h-9 rounded-md border border-border bg-card px-2 text-sm"
                aria-label={t('lang.label')}
              >
                <option value="es">{t('lang.es')}</option>
                <option value="en">{t('lang.en')}</option>
              </select>
              <Link
                to="/shop"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                {t('nav.getRank')}
              </Link>
            </div>

            <button className="p-2 md:hidden" onClick={() => setIsMobileMenuOpen((previous) => !previous)} type="button">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="border-t border-border py-4 md:hidden">
              <div className="flex flex-col gap-3">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-2 text-sm">{t('nav.home')}</Link>
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-2 text-sm">{t('nav.store')}</Link>
                <a href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-2 text-sm">{t('nav.features')}</a>
                <a href="/#ranks" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-2 text-sm">{t('nav.ranks')}</a>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-2 text-sm">{t('nav.login')}</Link>
                <div className="px-2 py-2">
                  <label className="sr-only" htmlFor="mobile-language">{t('lang.label')}</label>
                  <select
                    id="mobile-language"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as 'es' | 'en')}
                    className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm"
                  >
                    <option value="es">{t('lang.es')}</option>
                    <option value="en">{t('lang.en')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <div className="pt-20 lg:pt-24">{children}</div>

      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-8">
            <div className="md:col-span-1">
              <Link to="/" className="mb-4 flex items-center gap-3">
                <span className="h-7 w-7">
                  <img
                    src="/tree-icon.png"
                    alt="Bifrost tree icon"
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="logo-wordmark text-[1.8rem] leading-none">
                  BIFRÖST
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/">{t('nav.home')}</Link></li>
                <li><Link to="/shop">{t('nav.store')}</Link></li>
                <li><Link to="/login">{t('nav.login')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">{t('footer.support')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://discord.gg/bifrost" target="_blank" rel="noreferrer">Discord</a></li>
                <li><span>{t('footer.contact')}</span></li>
                <li><span>{t('footer.bugReports')}</span></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span>{t('footer.terms')}</span></li>
                <li><span>{t('footer.privacy')}</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Bifrost UHC. {t('footer.rights')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('footer.notAffiliated')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
