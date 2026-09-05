import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  Code2,
  ExternalLink,
  Github,
  Grid3X3,
  Linkedin,
  Mail,
  Menu,
  MousePointer2,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const handleOrbMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!orbRef.current) return;
    const bounds = orbRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 22;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -22;
    orbRef.current.style.setProperty('--orb-x', `${y}deg`);
    orbRef.current.style.setProperty('--orb-y', `${x}deg`);
  };

  const resetOrb = () => {
    orbRef.current?.style.setProperty('--orb-x', '0deg');
    orbRef.current?.style.setProperty('--orb-y', '0deg');
  };

  return (
    <div className="portfolio-page">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand-mark" href="#top" data-testid="link-brand">
            <span className="brand-symbol"><span>k</span></span>
            <span>Kavi / Perera</span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#work" data-testid="link-work">Selected work</a>
            <a href="#about" data-testid="link-about">About</a>
            <a href="#contact" data-testid="link-contact">Contact</a>
          </nav>
          <div className="header-availability"><span className="status-dot" /> accepting select projects</div>
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" data-testid="button-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
            <a href="#work" onClick={() => setMenuOpen(false)} data-testid="mobile-link-work">Selected work</a>
            <a href="#about" onClick={() => setMenuOpen(false)} data-testid="mobile-link-about">About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} data-testid="mobile-link-contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="section-inner hero-inner">
            <div className="hero-kicker"><span className="status-dot" /> independent designer / developer</div>
            <div className="hero-copy">
              <h1 className="hero-title">Interfaces with<br /><em>a pulse.</em></h1>
              <p className="hero-subtitle">I’m Kavi Perera — a digital designer and frontend developer building clear, kinetic experiences for people with something worth saying.</p>
            </div>
            <div className="hero-orbit" ref={orbRef} onMouseMove={handleOrbMove} onMouseLeave={resetOrb} data-testid="interactive-hero-orb">
              <div className="orb-core" />
              <span className="orb-chip one">01 / SYSTEMS</span>
              <span className="orb-chip two">FORM + FEELING</span>
              <span className="orb-chip three">ONLINE</span>
            </div>
          </div>
          <a className="hero-scroll" href="#work" data-testid="link-scroll-work">scroll to explore <ChevronDown size={15} /></a>
        </section>

        <div className="signal-band" aria-hidden="true">
          <div className="signal-track">
            <span>design systems</span><b>·</b><span>frontend craft</span><b>·</b><span>digital products</span><b>·</b><span>motion + identity</span><b>·</b>
            <span>design systems</span><b>·</b><span>frontend craft</span><b>·</b><span>digital products</span><b>·</b><span>motion + identity</span><b>·</b>
          </div>
        </div>

        <section className="section" id="work">
          <div className="section-inner">
            <div className="work-head reveal">
              <div>
                <div className="section-label">01 / selected work</div>
                <h2 className="section-heading">Small teams.<br /><span>Large signal.</span></h2>
              </div>
              <p className="work-note">A selection of recent collaborations, experiments, and products built from first principles.</p>
            </div>
            <div className="project-grid">
              <ProjectCard index="01" type="product / 2024" title="Atlas House" description="A calmer operating system for independent teams to map decisions, people, and momentum in one shared space." tags={['product design', 'react', 'systems']} art="art-atlas" delay="delay-1" />
              <ProjectCard index="02" type="identity / 2024" title="Lumen Objects" description="A quiet, tactile storefront for a studio making lighting that changes the temperature of a room." tags={['art direction', 'shopify', 'motion']} art="art-lumen" delay="delay-2" />
              <ProjectCard index="03" type="experiment / 2023" title="Afterimage Studio" description="A living archive for image-makers where the interface fades away and the work keeps its edge." tags={['creative code', 'three.js', 'webgl']} art="art-studio" delay="delay-2" />
              <ProjectCard index="04" type="platform / 2023" title="Signal / FM" description="Reframing the city guide as a daily frequency: local, opinionated, and built for curious wandering." tags={['ux strategy', 'frontend', 'content']} art="art-signal" delay="delay-3" />
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="section-inner">
            <div className="about-layout">
              <div className="reveal">
                <div className="section-label">02 / the approach</div>
                <h2 className="section-heading">Clarity is a<br /><span>creative act.</span></h2>
                <p className="about-copy">I work at the seam between <strong>visual direction and technical detail</strong> — shaping the idea, then staying close enough to the code to make sure it survives contact with reality.</p>
                <p className="about-copy">Based in Colombo, working anywhere. Available for a small number of thoughtful collaborations each quarter.</p>
                <div className="about-stats">
                  <div className="stat"><div className="stat-number">08</div><div className="stat-label">years making<br />for screens</div></div>
                  <div className="stat"><div className="stat-number">31</div><div className="stat-label">launches, large<br />and small</div></div>
                  <div className="stat"><div className="stat-number">06</div><div className="stat-label">countries in<br />the orbit</div></div>
                </div>
              </div>
              <div className="about-aside reveal delay-2">
                <div className="about-aside-title">The toolkit, in motion.</div>
                <div className="capability-list">
                  <div className="capability-row"><span>Art direction & identity</span><Sparkles size={15} /></div>
                  <div className="capability-row"><span>Product strategy & UX</span><MousePointer2 size={15} /></div>
                  <div className="capability-row"><span>Frontend engineering</span><Code2 size={15} /></div>
                  <div className="capability-row"><span>Motion & interaction</span><Zap size={15} /></div>
                  <div className="capability-row"><span>Design systems</span><Grid3X3 size={15} /></div>
                </div>
                <div className="section-label" style={{ marginTop: 62 }}>tools on the desk</div>
                <p className="about-copy" style={{ fontSize: 13, marginTop: 18 }}>Figma / React / TypeScript / Next.js / WebGL / Framer Motion / the occasional paper sketch.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="section-inner">
            <div className="contact-card reveal">
              <div className="section-label">03 / make a little noise</div>
              <h2 className="section-heading">Have a good<br /><span>problem?</span></h2>
              <p>Tell me what you’re building, what feels stuck, or what you wish existed. I’ll get back to you with a useful thought — even if we’re not the right fit.</p>
              <a className="contact-button" href="mailto:hello@kaviperera.studio" data-testid="link-email-kavi">Start a conversation <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-inner footer-inner">
          <div className="footer-copy">© 2025 Kavi Perera / built with attention</div>
          <div className="footer-links">
            <a href="mailto:hello@kaviperera.studio" aria-label="Email Kavi" data-testid="footer-email"><Mail size={16} /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" data-testid="footer-github"><Github size={16} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-testid="footer-linkedin"><Linkedin size={16} /></a>
            <a href="#top" aria-label="Back to top" data-testid="footer-top"><ArrowDown size={16} style={{ transform: 'rotate(180deg)' }} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

type ProjectCardProps = {
  index: string;
  type: string;
  title: string;
  description: string;
  tags: string[];
  art: string;
  delay: string;
};

function ProjectCard({ index, type, title, description, tags, art, delay }: ProjectCardProps) {
  return (
    <article className={`project-card reveal ${delay}`} data-testid={`card-project-${index}`}>
      <div className={`project-art ${art}`}>
        <span className="project-index">{index} — 0{Number(index) + 1}</span>
        <span className="project-window"><ExternalLink size={12} /></span>
      </div>
      <div className="project-info">
        <div className="project-type">{type}</div>
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </article>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
