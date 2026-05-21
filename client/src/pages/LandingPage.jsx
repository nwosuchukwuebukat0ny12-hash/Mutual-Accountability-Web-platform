import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll-visible');
          if (entry.target.classList.contains('morph-reveal-trigger')) {
            entry.target.classList.add('animate-morph');
          }
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-animation-on-scroll]');
    animatedElements.forEach(el => {
      el.classList.add('animate-on-scroll-hidden');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-surface font-inter text-text overflow-x-hidden">
      {/* Centered Floating Navbar */}
      <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 md:px-desktop-margin">
        <div className="w-full max-w-7xl bg-white/70 backdrop-blur-md border border-white/20 px-4 md:px-8 py-4 flex justify-between items-center shadow-2xl transition-all hover:bg-white/80 rounded-md">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary flex items-center justify-center text-white font-heading font-bold text-xl transition-transform group-hover:scale-110">M</div>
            <span className="font-heading font-bold tracking-tighter text-2xl group-hover:italic transition-all">MUTUAL</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-heading text-xs uppercase tracking-widest font-semibold opacity-60">
            <a href="#philosophy" className="hover:opacity-100 transition-opacity">Philosophy</a>
            <a href="#system" className="hover:opacity-100 transition-opacity">The System</a>
            <a href="#memoirs" className="hover:opacity-100 transition-opacity">Memoirs</a>
          </div>

          <div className="hidden md:flex items-center gap-6 pl-6 border-l border-black/5">
            <Link to="/login" className="font-heading text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="btn-primary text-[10px] px-6 py-2">Join System</Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden flex flex-col gap-1.5"
            onClick={() => setIsMenuOpen(true)}
          >
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-4 h-0.5 bg-black self-end"></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-primary text-white transition-transform duration-700 ease-in-out transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col items-center justify-center gap-12 p-12">
          <button
            className="absolute top-12 right-12 text-4xl font-light hover:rotate-90 transition-transform text-white/60 hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >✕</button>
          <div className="flex flex-col items-center gap-8 text-center">
            <a href="#philosophy" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-bold hover:italic">Philosophy</a>
            <a href="#system" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-bold hover:italic">The System</a>
            <a href="#memoirs" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-bold hover:italic">Memoirs</a>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-heading font-bold uppercase tracking-widest border border-white/20 hover:bg-white/5">Login</Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-white text-primary w-full py-4 text-center font-heading font-bold uppercase tracking-widest">Join System</Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-36 pb-32 px-4 md:px-desktop-margin">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <span className="font-heading text-[10px] uppercase tracking-[0.4em] mb-8 hero-text-stagger opacity-50">Volume I: The Foundation</span>
            <h1 className="text-5xl md:text-[7rem] font-heading font-bold leading-[0.85] tracking-tighter mb-12 hero-text-stagger">
              SUCCESS IS <br />
              <span className="text-primary italic">MUTUAL.</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg md:text-2xl text-text-muted mb-12 leading-relaxed hero-text-stagger" style={{ animationDelay: '0.7s' }}>
              People set goals and quit because no one is watching. <span className="font-bold text-primary italic">Mutual changes that.</span> <br className="hidden md:block" />
              We pair you with a dedicated partner or let you bring your own to ensure you both follow through on every milestone.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 hero-text-stagger" style={{ animationDelay: '0.9s' }}>
              <Link to="/register" className="btn-primary px-12 py-5 text-lg md:text-xl shadow-2xl shadow-primary/20 hover:-translate-y-1">
                Join the System
              </Link>
              <button className="btn-outline px-12 py-5 text-lg md:text-xl transition-all">
                Request Invitation
              </button>
            </div>
          </div>

          {/* Hero Morph Reveal Section */}
          <div className="mt-24 md:mt-32 px-4 md:px-0">
            <div className="morph-container morph-reveal-trigger max-w-5xl mx-auto" data-animation-on-scroll>
              {/* Image Layers */}
              <img
                src="https://images.unsplash.com/photo-1658855305528-e73fac4f1ba0?auto=format&fit=crop&q=80&w=2000"
                alt="Partnership Base"
                className="morph-image morph-img-1"
              />
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&auto=format&fit=crop&q=60"
                alt="Team Sync"
                className="morph-image morph-img-2"
              />
              <img
                src="https://images.unsplash.com/photo-1594999791384-9870ed78f6b0?w=900&auto=format&fit=crop&q=60"
                alt="Mutual Success"
                className="morph-image morph-img-3"
              />

              {/* The "Green Slider" (Teal Bar) */}
              <div className="morph-slider"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-32 px-4 md:px-desktop-margin bg-white" data-animation-on-scroll>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="order-1 md:order-2">
            <span className="font-heading text-[10px] uppercase tracking-widest text-primary mb-6 block">Our Thesis</span>
            <h2 className="text-4xl md:text-7xl font-heading font-bold leading-none mb-12 tracking-tighter">
              Solitude is the <br />
              <span className="italic">enemy of progress.</span>
            </h2>
            <div className="space-y-8 text-lg md:text-xl text-text-muted leading-relaxed font-light">
              <p>The human brain is wired for social accountability. When we commit to a goal in private, the stakes are non-existent. The moment it gets difficult, we negotiate with ourselves. We quit.</p>
              <p className="border-l-2 border-primary pl-8 italic">Mutual bypasses this failure loop by introducing a partner into your performance architecture. You don't just owe it to yourself anymore. You owe it to the system.</p>
            </div>
          </div>
          <div className="order-2 md:order-1">
            <div className="relative aspect-video md:aspect-[4/5] overflow-hidden rounded">
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" alt="Philosophy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features - "The Loop" */}
      <section id="system" className="py-32 px-4 md:px-desktop-margin bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div data-animation-on-scroll>
              <span className="font-heading text-[10px] uppercase tracking-widest text-primary mb-6 block">The Loop</span>
              <h2 className="text-5xl md:text-8xl font-heading font-bold tracking-tighter leading-none">THE SYSTEM <br /><span className="italic">COMPONENTS.</span></h2>
            </div>
            <div className="max-w-sm text-lg text-text-muted italic opacity-60" data-animation-on-scroll style={{ transitionDelay: '0.2s' }}>
              A high-precision suite of tools designed to synchronize ambition and action.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Feature 01 */}
            <div className="group cursor-pointer" data-animation-on-scroll>
              <div className="relative overflow-hidden aspect-video md:aspect-[3/4] mb-8 rounded shadow-lg transition-all group-hover:shadow-2xl">
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
              <p className="text-lg md:text-xl italic text-text-muted opacity-70 mb-6 font-heading">High-precision goal setting with weighted milestones.</p>
              <div className="w-full h-[1px] bg-primary/10"></div>
            </div>

            {/* Feature 02 */}
            <div className="group cursor-pointer" data-animation-on-scroll style={{ transitionDelay: '0.2s' }}>
              <div className="relative overflow-hidden aspect-video md:aspect-[3/4] mb-8 rounded shadow-lg transition-all group-hover:shadow-2xl">
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
              <p className="text-lg md:text-xl italic text-text-muted opacity-70 mb-6 font-heading">A shared real-time activity stream for you and your partner.</p>
              <div className="w-full h-[1px] bg-primary/10"></div>
            </div>

            {/* Feature 03 */}
            <div className="group cursor-pointer" data-animation-on-scroll style={{ transitionDelay: '0.4s' }}>
              <div className="relative overflow-hidden aspect-video md:aspect-[3/4] mb-8 rounded shadow-lg transition-all group-hover:shadow-2xl">
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
              <p className="text-lg md:text-xl italic text-text-muted opacity-70 mb-6 font-heading">Algorithmic matching based on career trajectory and ambition.</p>
              <div className="w-full h-[1px] bg-primary/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - "Memoirs" */}
      <section id="memoirs" className="py-32 px-4 md:px-desktop-margin bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="md:col-span-2" data-animation-on-scroll>
              <h2 className="text-5xl md:text-8xl font-heading font-bold tracking-tighter mb-12">THE PERFORMANCE <br /><span className="italic text-primary">MEMOIRS.</span></h2>
              <div className="relative bg-surface p-12 md:p-24 rounded shadow-sm border border-black/5">
                <span className="text-8xl font-heading font-bold text-primary opacity-20 absolute top-8 left-8">“</span>
                <p className="text-3xl md:text-4xl font-heading font-bold leading-tight relative z-10 italic">
                  I used to quit on myself by Tuesday. With my Mutual partner tracking my milestones, I haven't missed a single sprint in six months. The psychology works.
                </p>
                <div className="mt-12 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full"></div>
                  <div>
                    <span className="block font-heading font-bold text-lg uppercase tracking-tighter">Julian Vance</span>
                    <span className="block text-sm opacity-50 uppercase tracking-widest">Performance Architect</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-12" data-animation-on-scroll style={{ transitionDelay: '0.3s' }}>
              <div className="p-8 border border-black/5 rounded hover:bg-surface transition-all cursor-pointer">
                <p className="text-lg italic mb-6">"Mutual didn't just give me a tool, it gave me a standard. I push because my partner pushes."</p>
                <span className="font-heading font-bold uppercase text-xs tracking-widest">Sarah K. • CTO</span>
              </div>
              <div className="p-8 border border-black/5 rounded hover:bg-surface transition-all cursor-pointer">
                <p className="text-lg italic mb-6">"The only platform that respects the high-performance mindset. Precision engineering."</p>
                <span className="font-heading font-bold uppercase text-xs tracking-widest">Marcus T. • Founder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="bg-primary text-white py-32 px-4 md:px-desktop-margin">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-8xl font-heading font-bold tracking-tighter mb-12">MUTUALIZE <br /><span className="italic text-white/40">YOUR GOALS.</span></h2>
          <Link to="/register" className="bg-white text-primary px-16 py-6 text-xl md:text-2xl font-heading font-bold rounded shadow-2xl hover:-translate-y-1 transition-all">
            Apply for Access
          </Link>
          <div className="mt-24 w-full h-[1px] bg-white/10 mb-12"></div>
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8 opacity-40 font-heading text-[10px] uppercase tracking-widest">
            <span>© 2026 MUTUAL SYSTEM</span>
            <div className="flex gap-8">
              <span>All rights reserved</span>
              <span className="hidden md:inline">London / New York / Lagos</span>
            </div>
            <span className="md:hidden">London / New York / Lagos</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
