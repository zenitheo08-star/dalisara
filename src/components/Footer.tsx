import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowUpRight, Compass, Waves, Check, Sparkles, Phone, Mail, Clock, MapPin } from 'lucide-react';
import { TouchRippleLink, TouchRippleButton } from './TouchRipple';
import { useBooking } from '../store';

export function Footer() {
  const { setBookingModalOpen } = useBooking();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [localTime, setLocalTime] = useState('');

  // Live Philippine Standard Time (PST, GMT+8)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-sand-100 dark:bg-[#070908] text-ink-900 dark:text-[#EDE8DE] border-t border-ink-900/10 dark:border-white/10 overflow-hidden transition-colors duration-700">
      {/* Subtle architectural grid lines */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ink-900/[0.02] dark:from-white/[0.02] via-transparent to-transparent" />

      {/* Top Station Bar: Live Sanctuary Telemetry */}
      <div className="border-b border-ink-900/10 dark:border-white/10 px-6 md:px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-mono text-ink-700 dark:text-[#A8A398] bg-sand-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-sans font-medium tracking-widest text-ink-900 dark:text-[#FCFAF5]">
              Sanctuary Station
            </span>
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="hidden sm:inline">10°31&apos;48&quot;N 119°17&apos;24&quot;E</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 opacity-60" />
              <span>San Vicente {localTime ? `${localTime} PST` : 'GMT+8'}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Waves className="w-3.5 h-3.5 opacity-60" />
              <span>Sulu Sea • 28°C / 82°F</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
          {/* Brand Philosophy & Gazette Dispatch */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-block text-3xl md:text-4xl font-serif tracking-[0.3em] uppercase text-ink-900 dark:text-[#FCFAF5] mb-6">
                Dalisara
              </Link>
              <p className="text-sm md:text-base font-serif italic text-ink-800 dark:text-[#EDE8DE] leading-relaxed max-w-md mb-8">
                &ldquo;The coast, at a slower measure. A secluded sanctuary where raw Palawan jungle converges with the crystalline stillness of the Sulu Sea.&rdquo;
              </p>
              
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-700 dark:text-[#CFC9BE] mb-8">
                <MapPin className="w-3.5 h-3.5 opacity-60 text-ink-900 dark:text-[#FCFAF5]" />
                <span>San Vicente, Palawan, Philippines</span>
              </div>
            </div>

            {/* The Gazette Subscription */}
            <div className="p-6 md:p-8 rounded-2xl bg-sand-50 dark:bg-white/[0.04] border border-ink-900/10 dark:border-white/10 max-w-md shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-ink-900 dark:text-[#FBF8F0]" />
                <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-ink-900 dark:text-[#FCFAF5]">
                  The Palawan Dispatch
                </h4>
              </div>
              <p className="text-xs text-ink-700 dark:text-[#CFC9BE] leading-relaxed mb-5">
                Seasonal chronicles of untamed coastlines, botanical wellness rituals, and island expeditions.
              </p>

              <AnimatePresence mode="wait">
                {isSubscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-medium border border-emerald-500/20"
                  >
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>You have been subscribed to our private seasonal gazette.</span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white dark:bg-[#121513] border border-ink-900/15 dark:border-white/15 rounded-xl text-xs text-ink-900 dark:text-[#FCFAF5] placeholder:text-ink-400 dark:placeholder:text-[#A8A398]/60 focus:outline-none focus:border-ink-900 dark:focus:border-white/50 transition-colors"
                    />
                    <TouchRippleButton
                      type="submit"
                      className="px-5 py-3 bg-ink-900 text-sand-50 rounded-xl text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap hover:bg-ink-800 transition-colors"
                    >
                      Join
                    </TouchRippleButton>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigational Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-10">
            {/* Sanctuary Pavilions & Dining */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-ink-900 dark:text-[#FCFAF5] mb-6">
                The Estate
              </h4>
              <ul className="flex flex-col gap-3.5 text-xs text-ink-700 dark:text-[#CFC9BE]">
                <li>
                  <Link to="/stays" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Grove Pavilions
                  </Link>
                </li>
                <li>
                  <Link to="/stays" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Beachfront Pool Villas
                  </Link>
                </li>
                <li>
                  <Link to="/dining" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    The Shore Kitchen
                  </Link>
                </li>
                <li>
                  <Link to="/dining" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Cellar & Sunset Bar
                  </Link>
                </li>
                <li>
                  <Link to="/wellness" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Wellness House
                  </Link>
                </li>
                <li>
                  <Link to="/wellness" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Body Treatments
                  </Link>
                </li>
              </ul>
            </div>

            {/* Expeditions & Journeys */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-ink-900 dark:text-[#FCFAF5] mb-6">
                Journeys
              </h4>
              <ul className="flex flex-col gap-3.5 text-xs text-ink-700 dark:text-[#CFC9BE]">
                <li>
                  <Link to="/experiences" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    The Outrigger Voyage
                  </Link>
                </li>
                <li>
                  <Link to="/experiences" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Secret Cove Diving
                  </Link>
                </li>
                <li>
                  <Link to="/location" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Long Beach (14km)
                  </Link>
                </li>
                <li>
                  <Link to="/location" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Private Air Transfers
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Architecture & Heritage
                  </Link>
                </li>
                <li>
                  <Link to="/policies" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] hover:translate-x-0.5 transition-all inline-block">
                    Guest Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            {/* Concierge & Inquiries */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-ink-900 dark:text-[#FCFAF5] mb-6">
                Concierge
              </h4>
              <ul className="flex flex-col gap-4 text-xs text-ink-700 dark:text-[#CFC9BE] mb-8">
                <li>
                  <a
                    href="mailto:reservations@dalisara-fictional.com"
                    className="flex items-center gap-2 hover:text-ink-900 dark:hover:text-[#FCFAF5] transition-colors break-all"
                  >
                    <Mail className="w-3.5 h-3.5 flex-shrink-0 text-ink-900 dark:text-[#FCFAF5]" />
                    <span>reservations@dalisara.ph</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+63288880000"
                    className="flex items-center gap-2 hover:text-ink-900 dark:hover:text-[#FCFAF5] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 flex-shrink-0 text-ink-900 dark:text-[#FCFAF5]" />
                    <span>+63 2 8888 0000</span>
                  </a>
                </li>
              </ul>

              <div>
                <TouchRippleButton
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3.5 px-6 bg-ink-900 text-sand-50 rounded-xl text-[11px] uppercase tracking-[0.2em] font-semibold text-center block shadow-md hover:bg-ink-800 transition-colors"
                >
                  Reserve Stay
                </TouchRippleButton>
              </div>
            </div>
          </div>
        </div>

        {/* Grand Typography Brand Watermark Banner */}
        <div className="pt-12 pb-8 border-t border-ink-900/10 dark:border-white/10 flex flex-col md:flex-row items-baseline justify-between gap-6">
          <div className="overflow-hidden w-full">
            <span className="font-serif text-[clamp(2.5rem,10vw,7.5rem)] leading-none uppercase tracking-[0.22em] text-ink-900/[0.08] dark:text-white/[0.08] select-none block whitespace-nowrap">
              DALISARA
            </span>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-ink-700 dark:text-[#CFC9BE] hover:text-ink-900 dark:hover:text-[#FCFAF5] whitespace-nowrap group transition-colors flex-shrink-0"
          >
            <span>Return to Top</span>
            <div className="w-8 h-8 rounded-full border border-ink-900/20 dark:border-white/20 flex items-center justify-center group-hover:border-ink-900 dark:group-hover:border-white group-hover:-translate-y-1 transition-all">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Concept Disclosure Boundary */}
        <div className="pt-8 pb-4 border-t border-ink-900/10 dark:border-white/10 text-center md:text-left">
          <p className="text-[10px] uppercase tracking-widest text-ink-500 dark:text-[#A8A398] leading-relaxed max-w-4xl opacity-80">
            <strong>Project Note / Concept Disclosure:</strong> Dalisara is a fictional resort concept. This booking experience is a portfolio simulation and does not create a real reservation or charge a payment method. No hotel enquiry is delivered, and no real inventory is queried.
          </p>
        </div>

        {/* Sustainable Accreditations & Bottom Legal Bar */}
        <div className="pt-4 border-t border-ink-900/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-ink-400 dark:text-[#A8A398] tracking-widest uppercase">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>&copy; {new Date().getFullYear()} Dalisara Concept</span>
            <span className="opacity-30 hidden sm:inline">•</span>
            <span>Palawan Context</span>
            <span className="opacity-30 hidden sm:inline">•</span>
            <span>Reduced Single-Use Systems</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/policies" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] transition-colors">
              Privacy Behavior
            </Link>
            <Link to="/policies" className="hover:text-ink-900 dark:hover:text-[#FCFAF5] transition-colors">
              Terms of Stay
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
