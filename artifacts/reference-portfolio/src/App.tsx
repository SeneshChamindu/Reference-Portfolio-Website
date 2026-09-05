import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ClerkProvider, Show, SignIn, SignUp, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  ExternalLink,
  Github,
  Grid3X3,
  Linkedin,
  Mail,
  Menu,
  MousePointer2,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import centerPhoto from '@assets/walvers-w_6a56445c36dfe_1788627977453.jpg';
import {
  Route,
  Redirect,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
  },
  variables: {
    colorPrimary: '#c3ff47',
    colorForeground: '#eff4e5',
    colorMutedForeground: '#93a299',
    colorDanger: '#ff8b80',
    colorBackground: '#0b1715',
    colorInput: '#101f1c',
    colorInputForeground: '#eff4e5',
    colorNeutral: '#304039',
    fontFamily: 'Manrope, sans-serif',
    borderRadius: '0.65rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#0b1715] rounded-2xl w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#eff4e5]',
    headerSubtitle: 'text-[#93a299]',
    socialButtonsBlockButtonText: 'text-[#eff4e5]',
    formFieldLabel: 'text-[#eff4e5]',
    footerActionLink: 'text-[#c3ff47]',
    footerActionText: 'text-[#93a299]',
    dividerText: 'text-[#93a299]',
    identityPreviewEditButton: 'text-[#c3ff47]',
    formFieldSuccessText: 'text-[#c3ff47]',
    alertText: 'text-[#ffb0a9]',
    logoBox: 'h-12',
    logoImage: 'max-h-12',
    socialButtonsBlockButton: 'border-[#304039] bg-[#101f1c] hover:bg-[#182b25]',
    formButtonPrimary: 'bg-[#c3ff47] text-[#07110f] hover:bg-[#dcff9a]',
    formFieldInput: 'border-[#304039] bg-[#101f1c] text-[#eff4e5]',
    footerAction: 'bg-transparent',
    dividerLine: 'bg-[#304039]',
    alert: 'border-[#6e3936] bg-[#2c1717]',
    otpCodeFieldInput: 'border-[#304039] bg-[#101f1c] text-[#eff4e5]',
    formFieldRow: 'gap-2',
    main: 'gap-5',
  },
};

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [musicPosition, setMusicPosition] = useState<{ left: number; top: number } | null>(null);
  const audioNodesRef = useRef<{ context: AudioContext; gain: GainNode; oscillators: OscillatorNode[] } | null>(null);
  const musicDragRef = useRef<{ offsetX: number; offsetY: number; startX: number; startY: number } | null>(null);
  const musicDidDragRef = useRef(false);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    audioNodesRef.current?.oscillators.forEach((oscillator) => oscillator.stop());
    audioNodesRef.current?.context.close();
  }, []);

  const toggleSound = async () => {
    if (!audioNodesRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const gain = context.createGain();
      gain.gain.value = 0.0001;
      gain.connect(context.destination);
      const bass = context.createOscillator();
      const pad = context.createOscillator();
      bass.type = 'sine';
      pad.type = 'triangle';
      bass.frequency.value = 110;
      pad.frequency.value = 220;
      pad.detune.value = 5;
      bass.connect(gain);
      pad.connect(gain);
      bass.start();
      pad.start();
      audioNodesRef.current = { context, gain, oscillators: [bass, pad] };
    }
    const audio = audioNodesRef.current;
    if (audio.context.state === 'suspended') await audio.context.resume();
    const next = !soundOn;
    audio.gain.gain.cancelScheduledValues(audio.context.currentTime);
    audio.gain.gain.linearRampToValueAtTime(next ? 0.025 : 0.0001, audio.context.currentTime + 0.6);
    setSoundOn(next);
  };

  const handleMusicPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    musicDragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
    };
    musicDidDragRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMusicPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!musicDragRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nextLeft = Math.max(12, Math.min(window.innerWidth - rect.width - 12, event.clientX - musicDragRef.current.offsetX));
    const nextTop = Math.max(84, Math.min(window.innerHeight - rect.height - 12, event.clientY - musicDragRef.current.offsetY));
    if (Math.abs(event.clientX - musicDragRef.current.startX) > 3 || Math.abs(event.clientY - musicDragRef.current.startY) > 3) {
      musicDidDragRef.current = true;
    }
    setMusicPosition({ left: nextLeft, top: nextTop });
  };

  const handleMusicPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    musicDragRef.current = null;
  };

  return (
    <div className="portfolio-page">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand-mark" href="#top" data-testid="link-brand">
            <span className="brand-symbol"><span>P</span></span>
            <span>Prabath / Kumara</span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#work" data-testid="link-work">Work</a>
            <a href="#services" data-testid="link-services">Services</a>
            <a href="#about" data-testid="link-about">About</a>
            <a href="#contact" data-testid="link-contact">Contact</a>
          </nav>
          <AuthActions />
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" data-testid="button-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
            <a href="#work" onClick={() => setMenuOpen(false)} data-testid="mobile-link-work">Work</a>
            <a href="#services" onClick={() => setMenuOpen(false)} data-testid="mobile-link-services">Services</a>
            <a href="#about" onClick={() => setMenuOpen(false)} data-testid="mobile-link-about">About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} data-testid="mobile-link-contact">Contact</a>
            <Show when="signed-out">
              <a href={`${basePath}/sign-in`} onClick={() => setMenuOpen(false)} data-testid="mobile-link-sign-in">Sign in</a>
            </Show>
            <Show when="signed-in">
              <a href={`${basePath}/user-portal`} onClick={() => setMenuOpen(false)} data-testid="mobile-link-account">My account</a>
            </Show>
          </nav>
        </div>
      </header>

      <button
        className={`floating-music ${soundOn ? 'playing' : ''}`}
        style={musicPosition ? { left: `${musicPosition.left}px`, top: `${musicPosition.top}px`, bottom: 'auto', transform: 'none' } : undefined}
        onPointerDown={handleMusicPointerDown}
        onPointerMove={handleMusicPointerMove}
        onPointerUp={handleMusicPointerUp}
        onPointerCancel={handleMusicPointerUp}
        onClick={() => {
          if (musicDidDragRef.current) {
            musicDidDragRef.current = false;
            return;
          }
          void toggleSound();
        }}
        aria-label={soundOn ? 'Turn ambient music off' : 'Turn ambient music on'}
        aria-pressed={soundOn}
        title="Click to toggle music. Drag to move."
        data-testid="button-floating-music"
      >
        <span className="floating-music-icon">{soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}</span>
        <span className="floating-music-waves" aria-hidden="true"><i /><i /><i /><i /></span>
      </button>

      <main id="top">
        <section className="hero">
          <div className="hero-inner section-inner">
            <div className="hero-kicker"><span className="status-dot" /> independent builder / digital creator</div>
            <div className="hero-copy">
              <h1 className="hero-title">Hello, I am<br /><em>Prabath Kumara.</em></h1>
              <p className="hero-subtitle">I build useful digital products, tools, and experiences for people who want to move faster and make more impact.</p>
            </div>
            <div className="hero-stage" aria-label="Prabath's digital workspace">
              <div className="stage-photo">
                <img src={centerPhoto} alt="A quiet night journey by train" />
                <span className="photo-vignette" />
                <span className="photo-scan" />
                <span className="photo-caption">visual diary / 01</span>
              </div>
              <span className="stage-chip one">BUILD / SHIP</span>
              <span className="stage-chip two">IDEA + CODE</span>
              <span className="stage-chip three">ONLINE</span>
              <span className="stage-line line-one" />
              <span className="stage-line line-two" />
            </div>
            <div className="hero-meta">
              <span>Colombo, Sri Lanka</span>
              <span className="hero-meta-line" />
              <span>Available for select work</span>
            </div>
          </div>
          <a className="hero-scroll" href="#work" data-testid="link-scroll-work">explore the work <ArrowDown size={15} /></a>
        </section>

        <div className="signal-band" aria-hidden="true">
          <div className="signal-track">
            <span>software</span><b>·</b><span>automation</span><b>·</b><span>product design</span><b>·</b><span>digital experiences</span><b>·</b>
            <span>software</span><b>·</b><span>automation</span><b>·</b><span>product design</span><b>·</b><span>digital experiences</span><b>·</b>
          </div>
        </div>

        <section className="section" id="work">
          <div className="section-inner">
            <div className="work-head reveal">
              <div>
                <div className="section-label">01 / selected work</div>
                <h2 className="section-heading">Ideas into<br /><span>things people use.</span></h2>
              </div>
              <p className="work-note">A selection of products, tools, and experiments built to solve real problems.</p>
            </div>
            <div className="project-grid">
              <ProjectCard index="01" type="android app / featured" title="Sriboard App" description="Sinhala and English keyboard for Android with real-time translation, voice typing, theme studio, events, and more." url="https://sriboard.prabath.top/" tags={['Android', 'Java', 'Kotlin']} art="art-keyboard" delay="delay-1" />
              <ProjectCard index="02" type="wallpapers / featured" title="WallGenix" description="Premium 4K aesthetic wallpapers for mobile with vertical backgrounds, dark mode, anime, and daily inspiration." url="https://wallgenix.prabath.top/" tags={['Next.js', 'PWA', 'Design']} art="art-wallpaper" delay="delay-2" />
              <ProjectCard index="03" type="automation / featured" title="Prabath-MD" description="A powerful multi-device WhatsApp assistant built for useful automations, downloads, replies, and community tools." url="https://md.prabath.top/" tags={['Node.js', 'Baileys', 'WebSocket']} art="art-automation" delay="delay-2" />
              <ProjectCard index="04" type="developer tools" title="Next API" description="Small, focused APIs that help builders move from an idea to a working product without unnecessary friction." url="https://api.prabath.top/" tags={['Next.js', 'API', 'Open Source']} art="art-api" delay="delay-3" />
              <ProjectCard index="05" type="media platform" title="MovSL" description="A simple way to discover and enjoy local entertainment, built around speed, clarity, and a better browsing experience." url="https://movsl.prabath.top/" tags={['React', 'Content', 'UX']} art="art-media" delay="delay-2" />
              <ProjectCard index="06" type="developer tool" title="Subtitle TRT" description="A fast subtitle translation utility designed for creators who need to make their work accessible to more people." url="https://subtr.prabath.top/" tags={['Python', 'Tools', 'Creators']} art="art-subtitle" delay="delay-3" />
            </div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-inner">
            <div className="section-label reveal">02 / what I do</div>
            <div className="services-layout">
              <h2 className="section-heading reveal">Useful work,<br /><span>not just pretty screens.</span></h2>
              <div className="service-list reveal delay-1">
                <ServiceRow number="01" title="Product development" text="From first idea to launch-ready web and mobile products." icon={<Code2 size={17} />} />
                <ServiceRow number="02" title="Automation & tools" text="Practical automations that remove repetitive work from your day." icon={<Zap size={17} />} />
                <ServiceRow number="03" title="Interface & UX" text="Clear, expressive experiences that make complex things feel simple." icon={<MousePointer2 size={17} />} />
                <ServiceRow number="04" title="Creative technology" text="Experiments, systems, and digital identities with a point of view." icon={<Sparkles size={17} />} />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="section-inner">
            <div className="about-layout">
              <div className="reveal">
                <div className="section-label">03 / a little about me</div>
                <h2 className="section-heading">Curious by nature.<br /><span>Serious about the work.</span></h2>
                <p className="about-copy">I’m a developer and digital creator who likes turning ambitious ideas into <strong>useful, reliable, and memorable products.</strong> I work across code, design, automation, and content to keep the whole experience connected.</p>
                <p className="about-copy">Based in Colombo and working with people everywhere. I care about shipping, learning in public, and building things that earn their place in someone’s day.</p>
                <div className="about-stats">
                  <div className="stat"><div className="stat-number">06+</div><div className="stat-label">products &<br />experiments</div></div>
                  <div className="stat"><div className="stat-number">24/7</div><div className="stat-label">curiosity<br />online</div></div>
                  <div className="stat"><div className="stat-number">01</div><div className="stat-label">person behind<br />the work</div></div>
                </div>
              </div>
              <div className="about-aside reveal delay-2">
                <div className="about-aside-title">How I like to work.</div>
                <div className="capability-list">
                  <div className="capability-row"><span>Start with the real problem</span><Check size={15} /></div>
                  <div className="capability-row"><span>Make the first version quickly</span><Check size={15} /></div>
                  <div className="capability-row"><span>Keep the experience human</span><Check size={15} /></div>
                  <div className="capability-row"><span>Measure what matters</span><Check size={15} /></div>
                  <div className="capability-row"><span>Improve it after launch</span><Check size={15} /></div>
                </div>
                <div className="section-label" style={{ marginTop: 62 }}>tools on the desk</div>
                <p className="about-copy" style={{ fontSize: 13, marginTop: 18 }}>JavaScript / TypeScript / React / Next.js / Node.js / Android / automation / design systems.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="section-inner">
            <div className="contact-card reveal">
              <div className="section-label">04 / let’s build something</div>
              <h2 className="section-heading">Have an idea<br /><span>worth making real?</span></h2>
              <p>Tell me what you’re building, what feels stuck, or what you wish existed. I’m always open to a useful conversation.</p>
              <a className="contact-button" href="mailto:hello@prabath.top" data-testid="link-email-prabath">Start a conversation <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-inner footer-inner">
          <div className="footer-copy">© 2025 Prabath Kumara / built with curiosity</div>
          <div className="footer-links">
            <a href="mailto:hello@prabath.top" aria-label="Email Prabath" data-testid="footer-email"><Mail size={16} /></a>
            <a href="https://github.com/prabathLK" target="_blank" rel="noreferrer" aria-label="GitHub" data-testid="footer-github"><Github size={16} /></a>
            <a href="https://www.linkedin.com/in/prabath-kumara-b0353953" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-testid="footer-linkedin"><Linkedin size={16} /></a>
            <a href="#top" aria-label="Back to top" data-testid="footer-top"><ArrowDown size={16} style={{ transform: 'rotate(180deg)' }} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthActions() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="auth-actions">
      <Show when="signed-out">
        <a className="auth-link" href={`${basePath}/sign-in`} data-testid="link-sign-in">Sign in</a>
        <a className="auth-cta" href={`${basePath}/sign-up`} data-testid="link-sign-up">Create account</a>
      </Show>
      <Show when="signed-in">
        <a className="auth-user" href={`${basePath}/user-portal`} data-testid="link-account">
          <span className="auth-avatar">{(user?.firstName?.[0] || user?.username?.[0] || 'P').toUpperCase()}</span>
          <span>{user?.firstName || user?.username || 'Account'}</span>
        </a>
        <button className="auth-link auth-logout" onClick={() => signOut({ redirectUrl: basePath || '/' })} data-testid="button-sign-out">Log out</button>
      </Show>
    </div>
  );
}

function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-backdrop" />
      <a className="auth-back-link" href={basePath || '/'}>← Back to portfolio</a>
      <div className="auth-card">
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
        />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="auth-backdrop" />
      <a className="auth-back-link" href={basePath || '/'}>← Back to portfolio</a>
      <div className="auth-card">
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
        />
      </div>
    </div>
  );
}

function UserPortal() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="portal-page">
      <div className="portal-shell">
        <div className="portal-topline">
          <a className="brand-mark" href={basePath || '/'}>
            <span className="brand-symbol"><span>P</span></span>
            <span>Prabath / Kumara</span>
          </a>
          <button className="auth-link auth-logout" onClick={() => signOut({ redirectUrl: basePath || '/' })}>Log out</button>
        </div>
        <div className="portal-card">
          <div className="section-label">private space / account</div>
          <div className="portal-avatar">{(user?.firstName?.[0] || user?.username?.[0] || 'P').toUpperCase()}</div>
          <h1>Welcome, {user?.firstName || user?.username || 'there'}.</h1>
          <p>Your account is connected. This private space is ready for future project updates, downloads, and member-only content.</p>
          <a className="contact-button" href={basePath || '/'}>Back to the portfolio <ArrowUpRight size={16} /></a>
        </div>
      </div>
    </div>
  );
}

type ProjectCardProps = {
  index: string;
  type: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  art: string;
  delay: string;
};

function ProjectCard({ index, type, title, description, url, tags, art, delay }: ProjectCardProps) {
  return (
    <a className={`project-card reveal ${delay}`} href={url} target="_blank" rel="noreferrer" aria-label={`Open ${title}`} data-testid={`card-project-${index}`}>
      <div className={`project-art ${art}`}>
        <span className="project-index">{index} — 0{Number(index) + 1}</span>
        <span className="project-window"><ExternalLink size={12} /></span>
        <span className="project-art-mark">{index}</span>
      </div>
      <div className="project-info">
        <div className="project-type">{type}</div>
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </a>
  );
}

function ServiceRow({ number, title, text, icon }: { number: string; title: string; text: string; icon: ReactNode }) {
  return (
    <div className="service-row">
      <span className="service-number">{number}</span>
      <div className="service-copy"><h3>{title}</h3><p>{text}</p></div>
      <span className="service-icon">{icon}</span>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/user-portal" component={ProtectedUserPortal} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/user-portal" />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function ProtectedUserPortal() {
  return (
    <>
      <Show when="signed-in">
        <UserPortal />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  const stripBase = (path: string) =>
    basePath && path.startsWith(basePath)
      ? path.slice(basePath.length) || '/'
      : path;

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'Welcome back',
            subtitle: 'Sign in to access your account',
          },
        },
        signUp: {
          start: {
            title: 'Create your account',
            subtitle: 'Join Prabath Kumara online',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;