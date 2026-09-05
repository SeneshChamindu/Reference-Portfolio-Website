import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowUpRight,
  ChevronDown,
  Clapperboard,
  Film,
  Headphones,
  Mail,
  Menu,
  Pause,
  Play,
  Plus,
  Star,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import noirPoster from '@assets/generated_images/moonframe-noir.png';
import orbitPoster from '@assets/generated_images/moonframe-orbit.png';
import abyssPoster from '@assets/generated_images/moonframe-abyss.png';
import driftPoster from '@assets/generated_images/moonframe-drift.png';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundtrackPlaying, setSoundtrackPlaying] = useState(false);
  const audioNodesRef = useRef<{ context: AudioContext; gain: GainNode; oscillators: OscillatorNode[] } | null>(null);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      audioNodesRef.current?.oscillators.forEach((oscillator) => oscillator.stop());
      audioNodesRef.current?.context.close();
    };
  }, []);

  const toggleSoundtrack = async () => {
    if (!audioNodesRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const gain = context.createGain();
      gain.gain.value = 0.0001;
      gain.connect(context.destination);

      const bass = context.createOscillator();
      const shimmer = context.createOscillator();
      const pulse = context.createOscillator();
      bass.type = 'sine';
      shimmer.type = 'triangle';
      pulse.type = 'sine';
      bass.frequency.value = 98;
      shimmer.frequency.value = 196;
      pulse.frequency.value = 49;
      shimmer.detune.value = 7;
      bass.connect(gain);
      shimmer.connect(gain);
      pulse.connect(gain);
      bass.start();
      shimmer.start();
      pulse.start();
      audioNodesRef.current = { context, gain, oscillators: [bass, shimmer, pulse] };
    }

    const audio = audioNodesRef.current;
    if (audio.context.state === 'suspended') await audio.context.resume();
    const nextPlaying = !soundtrackPlaying;
    audio.gain.gain.cancelScheduledValues(audio.context.currentTime);
    audio.gain.gain.linearRampToValueAtTime(nextPlaying ? 0.04 : 0.0001, audio.context.currentTime + 0.8);
    setSoundtrackPlaying(nextPlaying);
  };

  return (
    <div className="portfolio-page">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand-mark" href="#top" data-testid="link-brand">
            <span className="brand-symbol"><Film size={16} /></span>
            <span>Moonframe / Cinema</span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#films" data-testid="link-films">Films</a>
            <a href="#story" data-testid="link-story">The story</a>
            <a href="#contact" data-testid="link-contact">Contact</a>
          </nav>
          <button className={`soundtrack-control ${soundtrackPlaying ? 'playing' : ''}`} onClick={toggleSoundtrack} aria-pressed={soundtrackPlaying} data-testid="button-soundtrack">
            {soundtrackPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{soundtrackPlaying ? 'score playing' : 'play score'}</span>
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" data-testid="button-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
            <a href="#films" onClick={() => setMenuOpen(false)} data-testid="mobile-link-films">Films</a>
            <a href="#story" onClick={() => setMenuOpen(false)} data-testid="mobile-link-story">The story</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} data-testid="mobile-link-contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-backdrop" style={{ backgroundImage: `url(${noirPoster})` }} />
          <div className="hero-vignette" />
          <div className="section-inner hero-inner">
            <div className="hero-kicker"><span className="status-dot" /> moonframe pictures / presents</div>
            <div className="hero-copy">
              <div className="hero-logo"><span className="hero-logo-mark"><Film size={28} /></span><span>MF</span></div>
              <h1 className="hero-title">Stories that stay<br /><em>after the credits.</em></h1>
              <p className="hero-subtitle">A private collection of imagined worlds, midnight characters, and films that leave the light on.</p>
            </div>
            <div className="hero-meta">
              <span>Volume 01</span>
              <span className="hero-meta-line" />
              <span>Colombo / 2025</span>
            </div>
          </div>
          <button className="hero-soundtrack" onClick={toggleSoundtrack} data-testid="hero-soundtrack">
            <span className="soundtrack-icon">{soundtrackPlaying ? <Pause size={13} /> : <Play size={13} />}</span>
            <span>{soundtrackPlaying ? 'now screening / ambient score' : 'tap to begin the score'}</span>
            <span className="sound-wave"><i /><i /><i /><i /></span>
          </button>
          <a className="hero-scroll" href="#films" data-testid="link-scroll-films">enter the archive <ChevronDown size={15} /></a>
        </section>

        <div className="signal-band" aria-hidden="true">
          <div className="signal-track">
            <span>moonframe pictures</span><b>+</b><span>original stories</span><b>+</b><span>after midnight</span><b>+</b><span>keep watching</span><b>+</b>
            <span>moonframe pictures</span><b>+</b><span>original stories</span><b>+</b><span>after midnight</span><b>+</b><span>keep watching</span><b>+</b>
          </div>
        </div>

        <section className="section films-section" id="films">
          <div className="section-inner">
            <div className="work-head reveal">
              <div>
                <div className="section-label">01 / the current programme</div>
                <h2 className="section-heading">Four films.<br /><span>One feeling.</span></h2>
              </div>
              <p className="work-note">A small archive of fictional films made for the hours when the city goes quiet.</p>
            </div>
            <div className="project-grid">
              <FilmCard index="01" year="2025" title="After Rain" type="neo-noir / 01:48" description="Some cities only tell the truth when the streets are wet." poster={noirPoster} delay="delay-1" />
              <FilmCard index="02" year="2025" title="The Quiet Orbit" type="science fiction / 02:06" description="A signal arrives from a place no one remembers leaving." poster={orbitPoster} delay="delay-2" />
              <FilmCard index="03" year="2024" title="Below the Blue" type="mystery / 01:52" description="The door was never meant to be found. That is why she opens it." poster={abyssPoster} delay="delay-2" />
              <FilmCard index="04" year="2024" title="Drift / 86" type="romance / 01:37" description="Two people, one last drive, and the long way home." poster={driftPoster} delay="delay-3" />
            </div>
          </div>
        </section>

        <section className="section story-section" id="story">
          <div className="section-inner">
            <div className="about-layout">
              <div className="reveal">
                <div className="section-label">02 / the story</div>
                <h2 className="section-heading">Every frame<br /><span>holds a secret.</span></h2>
                <p className="about-copy">Moonframe is a small independent cinema for <strong>strange hours and honest stories</strong> — an evolving collection of original worlds, film stills, and soundtracks for people who like to look twice.</p>
                <p className="about-copy">Made in Colombo, watched everywhere. New films arrive when they are ready.</p>
                <div className="about-stats">
                  <div className="stat"><div className="stat-number">04</div><div className="stat-label">films in<br />the archive</div></div>
                  <div className="stat"><div className="stat-number">35</div><div className="stat-label">mm of<br />grain</div></div>
                  <div className="stat"><div className="stat-number">∞</div><div className="stat-label">ways to<br />interpret</div></div>
                </div>
              </div>
              <div className="about-aside reveal delay-2">
                <div className="about-aside-title">The cinema notes.</div>
                <div className="capability-list">
                  <div className="capability-row"><span>Stories before spectacle</span><Star size={15} /></div>
                  <div className="capability-row"><span>Light as a character</span><Plus size={15} /></div>
                  <div className="capability-row"><span>Sound after silence</span><Headphones size={15} /></div>
                  <div className="capability-row"><span>Details worth replaying</span><Clapperboard size={15} /></div>
                  <div className="capability-row"><span>Always leave a little mystery</span><Film size={15} /></div>
                </div>
                <div className="section-label" style={{ marginTop: 62 }}>the projection room</div>
                <p className="about-copy" style={{ fontSize: 13, marginTop: 18 }}>35mm / midnight screenings / analogue synths / rain on glass / handwritten credits.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="section-inner">
            <div className="contact-card reveal">
              <div className="section-label">03 / screen something</div>
              <h2 className="section-heading">Have a story<br /><span>to tell?</span></h2>
              <p>Send a note for screenings, collaborations, or the next film you think belongs in the archive.</p>
              <a className="contact-button" href="mailto:hello@moonframe.cinema" data-testid="link-email-moonframe">Open the projection room <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-inner footer-inner">
          <div className="footer-copy">© 2025 Moonframe Pictures / stay for the credits</div>
          <div className="footer-links">
            <a href="mailto:hello@moonframe.cinema" aria-label="Email Moonframe" data-testid="footer-email"><Mail size={16} /></a>
            <a href="#films" aria-label="View films" data-testid="footer-films"><Film size={16} /></a>
            <a href="#top" aria-label="Back to top" data-testid="footer-top"><ChevronDown size={16} style={{ transform: 'rotate(180deg)' }} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

type FilmCardProps = {
  index: string;
  year: string;
  type: string;
  title: string;
  description: string;
  poster: string;
  delay: string;
};

function FilmCard({ index, year, type, title, description, poster, delay }: FilmCardProps) {
  return (
    <article className={`project-card film-card reveal ${delay}`} data-testid={`card-film-${index}`}>
      <div className="project-art" style={{ backgroundImage: `url(${poster})` }}>
        <div className="poster-shade" />
        <span className="project-index">NO. {index}</span>
        <span className="project-window">{year}</span>
        <span className="poster-stamp">MF / ORIGINAL</span>
      </div>
      <div className="project-info">
        <div className="project-type">{type}</div>
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tags"><span>screening</span><span>original</span></div>
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
