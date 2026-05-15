import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, CheckCircle, Activity, Award, ArrowRight, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Hero Entrance Logic
    const timer = setTimeout(() => {
      document.querySelectorAll('.hero-overlay-el').forEach(el => el.classList.add('active'));
      document.querySelectorAll('.hero-zoom-el').forEach(el => el.classList.add('active'));
    }, 100);

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animation-on-scroll]').forEach(el => {
      el.classList.add('animate-on-scroll-hidden');
      observer.observe(el);
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-base text-text flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center relative">
          {/* Floating Logo Box (Centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto bg-white/90 backdrop-blur-md border border-gray-200 px-6 md:px-8 py-3 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-3 group transition-all hover:shadow-[0_8px_30px_rgb(0,104,95,0.08)] min-w-[240px] md:min-w-[280px] h-[64px] justify-between md:justify-center">
            <Link to="/" className="flex items-center gap-3">
              <div 
                style={{ backgroundColor: '#00685f' }}
                className="w-8 h-8 text-white flex items-center justify-center font-bold rounded-sm text-lg shadow-sm group-hover:scale-105 transition-transform"
              >
                M
              </div>
              <span style={{ color: '#0b1c30' }} className="font-heading font-bold text-lg tracking-tight">Mutual</span>
            </Link>

            {/* Mobile Menu Trigger (Inside Logo Box) */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden w-8 h-8 flex items-center justify-center text-text hover:text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Actions (Right Side - Desktop) */}
          <div className="pointer-events-auto ml-auto hidden md:flex items-center gap-4">
            <Link to="/login" className="px-6 py-3 text-sm font-bold text-text hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary shadow-[0_8px_20px_rgba(0,104,95,0.15)]">
              Join System
            </Link>
          </div>
        </div>

        {/* Full-Screen Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-primary z-[60] flex flex-col items-center justify-center gap-12 transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform duration-300"
          >
            <X className="w-10 h-10" />
          </button>
          
          <nav className="flex flex-col items-center gap-8">
            <Link onClick={() => setIsMenuOpen(false)} to="#philosophy" className="font-heading text-4xl text-white hover:italic transition-all">Who we are</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="#features" className="font-heading text-4xl text-white hover:italic transition-all">The System</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="#loop" className="font-heading text-4xl text-white hover:italic transition-all">The Loop</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/login" className="font-heading text-4xl text-white/60 hover:text-white transition-all">Sign In</Link>
          </nav>
          
          <Link 
            onClick={() => setIsMenuOpen(false)}
            to="/register" 
            className="bg-white text-primary px-12 py-5 font-heading font-bold text-2xl rounded shadow-2xl mt-8"
          >
            Join System
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Editorial Hero Section */}
        <section className="relative flex flex-col lg:flex-row min-h-screen bg-base overflow-hidden border-b border-gray-200">
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8 lg:p-24 pt-36 lg:pt-24 border-r border-gray-100 z-10">
            <span className="font-heading text-xs uppercase tracking-[0.4em] text-primary mb-8 hero-text-stagger" style={{ animationDelay: '0.3s' }}>
              The Performance Method
            </span>
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold mb-10 leading-[0.85] text-text tracking-tighter hero-text-stagger" style={{ animationDelay: '0.5s' }}>
              Success <br/>
              <span className="italic font-normal">is Mutual</span>
            </h1>
            <p className="max-w-xl mx-auto text-xl md:text-2xl text-text-muted mb-12 leading-relaxed hero-text-stagger" style={{ animationDelay: '0.7s' }}>
              People set goals and quit because no one is watching. <span className="font-bold text-primary italic">Mutual changes that.</span> <br className="hidden md:block" />
              We pair you with a dedicated partner or let you bring your own to ensure you both follow through on every milestone.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 hero-text-stagger" style={{ animationDelay: '0.9s' }}>
              <Link to="/register" className="btn-primary px-12 py-5 text-xl shadow-2xl shadow-primary/20 hover:-translate-y-1">
                Begin Your Sprint
              </Link>
              <button className="px-12 py-5 border border-primary text-primary font-heading font-bold rounded hover:bg-primary hover:text-white transition-all italic text-xl">
                The Philosophy
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-surface overflow-hidden min-h-[500px]">
            <div className="reveal-overlay hero-overlay-el"></div>
            <div className="absolute inset-0 bg-primary/5 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1658855305528-e73fac4f1ba0?auto=format&fit=crop&q=80&w=2000" 
              alt="The Partnership" 
              className="w-full h-full object-cover image-zoom-reveal hero-zoom-el"
            />
            <div className="absolute bottom-12 right-12 z-20 bg-white/90 backdrop-blur-md p-8 border border-gray-200 hidden md:block hero-text-stagger shadow-xl" style={{ animationDelay: '1.2s' }}>
              <p className="font-heading text-2xl italic text-primary">"Momentum is built together."</p>
            </div>
          </div>
        </section>

        {/* Volume I: The Philosophy */}
        <section className="py-32 lg:py-48 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-20 items-start">
              <div className="lg:w-1/3" data-animation-on-scroll>
                <span className="font-heading text-xs uppercase tracking-widest text-primary block mb-8">— Volume I: The Logic</span>
                <h2 className="text-5xl lg:text-7xl leading-tight text-text tracking-tighter">The Science of Accountability</h2>
              </div>
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24" data-animation-on-scroll>
                <div className="space-y-6">
                  <span className="text-sm font-bold opacity-20">01.</span>
                  <h3 className="text-3xl font-heading text-text">The Spotlight Effect</h3>
                  <p className="text-lg leading-relaxed text-text-muted">
                    Psychology proves we are 95% more likely to achieve a goal when we share it with a specific accountability partner. Silence is the enemy of progress.
                  </p>
                </div>
                <div className="space-y-6">
                  <span className="text-sm font-bold opacity-20">02.</span>
                  <h3 className="text-3xl font-heading text-text">Frictionless Check-ins</h3>
                  <p className="text-lg leading-relaxed text-text-muted">
                    No long reports. No boring meetings. Just high-impact, real-time "Proof of Work" shared directly with your partner in a dedicated loop.
                  </p>
                </div>
                <div className="space-y-6">
                  <span className="text-sm font-bold opacity-20">03.</span>
                  <h3 className="text-3xl font-heading text-text">Positive Pressure</h3>
                  <p className="text-lg leading-relaxed text-text-muted">
                    We don't use shame. We use shared momentum. When your partner wins, the system rewards you both. Your success is inherently linked.
                  </p>
                </div>
                <div className="space-y-6">
                  <span className="text-sm font-bold opacity-20">04.</span>
                  <h3 className="text-3xl font-heading text-text">Sprint Durations</h3>
                  <p className="text-lg leading-relaxed text-text-muted">
                    Mutual is built for focused sprints. We don't believe in indefinite tracking. We believe in 30-day high-performance windows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Core System (Gallery) */}
        <section className="bg-base py-32 lg:py-48 px-6 border-y border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-20 lg:mb-32" data-animation-on-scroll>
              <div>
                <span className="font-heading text-xs uppercase tracking-widest text-primary block mb-6">The Toolset</span>
                <h2 className="text-5xl lg:text-8xl text-text italic font-normal tracking-tighter">The System</h2>
              </div>
              <Link to="/features" className="font-heading text-xs uppercase tracking-widest border-b border-primary pb-2 mb-4 hover:opacity-60 transition-opacity hidden md:block">Full Component Index</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Feature 01 */}
              <div className="group cursor-pointer" data-animation-on-scroll>
                <div className="relative overflow-hidden aspect-[3/4] mb-8 rounded shadow-lg transition-all group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center p-8 text-center">
                    <p className="text-white font-heading italic text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      "Bypasses the 40% planning-to-action drop-off seen in solo goal setting."
                    </p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800" alt="Goal Engine" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    <span className="font-heading text-[10px] text-white uppercase tracking-widest bg-primary px-3 py-1 self-start">Module: ENG-01</span>
                    <span className="font-heading text-[8px] text-white/80 uppercase tracking-widest bg-black/40 backdrop-blur px-2 py-0.5 self-start">Precision: 0.1mm</span>
                  </div>
                </div>
                <h3 className="text-2xl font-heading text-text mb-4 group-hover:italic transition-all">The Goal Engine</h3>
                <p className="text-xl italic text-text-muted opacity-70 mb-6 font-heading">High-precision goal setting with weighted milestones.</p>
                <div className="w-full h-[1px] bg-primary/10"></div>
              </div>

              {/* Feature 02 */}
              <div className="group cursor-pointer" data-animation-on-scroll style={{ transitionDelay: '0.2s' }}>
                <div className="relative overflow-hidden aspect-[3/4] mb-8 rounded shadow-lg transition-all group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center p-8 text-center">
                    <p className="text-white font-heading italic text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      "Mirroring partner activity in real-time increases dopamine release by 2x."
                    </p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Real-time Feed" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    <span className="font-heading text-[10px] text-white uppercase tracking-widest bg-primary px-3 py-1 self-start">Module: FED-02</span>
                    <span className="font-heading text-[8px] text-white/80 uppercase tracking-widest bg-black/40 backdrop-blur px-2 py-0.5 self-start">Latency: &lt;10ms</span>
                  </div>
                </div>
                <h3 className="text-2xl font-heading text-text mb-4 group-hover:italic transition-all">The Pulse Feed</h3>
                <p className="text-xl italic text-text-muted opacity-70 mb-6 font-heading">A shared real-time activity stream for you and your partner.</p>
                <div className="w-full h-[1px] bg-primary/10"></div>
              </div>

              {/* Feature 03 */}
              <div className="group cursor-pointer" data-animation-on-scroll style={{ transitionDelay: '0.4s' }}>
                <div className="relative overflow-hidden aspect-[3/4] mb-8 rounded shadow-lg transition-all group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center p-8 text-center">
                    <p className="text-white font-heading italic text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      "Matching career trajectory similarity reduces partnership friction by 60%."
                    </p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Partner Matching" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    <span className="font-heading text-[10px] text-white uppercase tracking-widest bg-primary px-3 py-1 self-start">Module: PTR-03</span>
                    <span className="font-heading text-[8px] text-white/80 uppercase tracking-widest bg-black/40 backdrop-blur px-2 py-0.5 self-start">Accuracy: 98.4%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-heading text-text mb-4 group-hover:italic transition-all">Partner Sync</h3>
                <p className="text-xl italic text-text-muted opacity-70 mb-6 font-heading">Algorithmic matching based on career trajectory and ambition.</p>
                <div className="w-full h-[1px] bg-primary/10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials / Memoirs */}
        <section className="py-32 lg:py-48 bg-primary text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
              <span className="font-heading text-[300px] leading-none select-none tracking-tighter">SPRINT</span>
            </div>
            
            <div className="text-center mb-24" data-animation-on-scroll>
              <span className="font-heading text-xs uppercase tracking-[0.4em] text-white/60 mb-8 block">— Verified Wins</span>
              <h2 className="text-5xl lg:text-7xl font-heading tracking-tighter italic font-normal">Memoirs of the Loop</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 relative z-10">
              <div className="space-y-8" data-animation-on-scroll>
                <p className="text-2xl italic leading-relaxed opacity-90 font-heading">"Solo goal tracking is a myth. Mutual turned my erratic work habits into a 30-day streak of pure output."</p>
                <div>
                  <h4 className="text-xl font-bold">Sarah K.</h4>
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Sprint Lead • Techstars</span>
                </div>
              </div>
              
              <div className="space-y-8" data-animation-on-scroll style={{ transitionDelay: '0.2s' }}>
                <p className="text-2xl italic leading-relaxed opacity-90 font-heading">"The 'Pulse' feed changed everything. Knowing my partner is watching my milestones keeps me in the game when I'm tired."</p>
                <div>
                  <h4 className="text-xl font-bold">David L.</h4>
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Founder • Stealth Startup</span>
                </div>
              </div>

              <div className="space-y-8" data-animation-on-scroll style={{ transitionDelay: '0.4s' }}>
                <p className="text-2xl italic leading-relaxed opacity-90 font-heading">"Most productivity tools feel like homework. Mutual feels like a high-stakes partnership. It's actually addictive."</p>
                <div>
                  <h4 className="text-xl font-bold">Avery R.</h4>
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Creative Director</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="booking" className="py-32 lg:py-48 bg-white px-6">
          <div className="max-w-4xl mx-auto text-center" data-animation-on-scroll>
            <span className="font-heading text-xs uppercase tracking-widest text-primary mb-10 block">Final Volume</span>
            <h2 className="text-6xl lg:text-9xl text-text font-bold tracking-tighter mb-12">Commit to the System</h2>
            <p className="text-2xl lg:text-3xl italic text-text-muted mb-16 max-w-2xl mx-auto leading-relaxed">We are currently in private beta. Request an invitation for the next 30-day sprint.</p>
            
            <Link to="/register" className="inline-flex items-center gap-4 bg-primary text-white px-16 py-7 text-2xl font-bold rounded shadow-2xl hover:bg-primary-container transition-all hover:-translate-y-1">
              Request Invitation
              <ArrowRight className="w-8 h-8" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-base border-t border-gray-200 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div style={{ backgroundColor: '#00685f' }} className="w-8 h-8 text-white flex items-center justify-center font-bold rounded-sm text-lg">M</div>
              <span className="font-heading font-bold text-xl tracking-tight text-text">Mutual</span>
            </div>
            <p className="text-xl italic text-text-muted max-w-md leading-relaxed">
              Preserving high-performance through radical partnership and shared accountability.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-10 text-primary font-bold">The Archive</h4>
            <ul className="space-y-4 text-sm font-medium text-text-muted">
              <li><Link to="#" className="hover:text-primary transition-colors">The Philosophy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Partner Matching</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-10 text-primary font-bold">Connect</h4>
            <ul className="space-y-4 text-sm font-medium text-text-muted">
              <li><Link to="#" className="hover:text-primary transition-colors">Instagram</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">X (Twitter)</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-gray-100 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest opacity-40">© {new Date().getFullYear()} Mutual Platform. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100">Privacy Policy</Link>
            <Link to="#" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
