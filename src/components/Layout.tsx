import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { GuestConcierge } from './GuestConcierge';
import { ThemeToggle } from './ThemeToggle';
import { Menu as DropdownMenu, MenuItem, ProductItem, HoveredLink } from './DropdownMenu';
import { TouchRippleLink, TouchRippleButton } from './TouchRipple';
import { ScrollProgress } from './ScrollProgress';
import { Footer } from './Footer';
import { useBooking } from '../store';

const NAV_LINKS = [
  { label: 'Stays', href: '/stays', sub: 'Pavilions & Villas' },
  { label: 'Dining', href: '/dining', sub: 'The Shore Kitchen & Cellar' },
  { label: 'Wellness', href: '/wellness', sub: 'The Sanctuary & Spa' },
  { label: 'Experiences', href: '/experiences', sub: 'Island & Marine Expeditions' },
  { label: 'Destination', href: '/location', sub: 'San Vicente, Palawan' },
];

export function Layout() {
  const { setBookingModalOpen } = useBooking();
  const { scrollY } = useScroll();
  const [isCompact, setIsCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [activeRight, setActiveRight] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
      if (current < 50) {
        setIsCompact(false);
      } else {
        setIsCompact(true);
      }
    }
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-6 py-4 bg-ink-900 text-sand-50 text-[10px] uppercase tracking-[0.3em] font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink-900"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <motion.header
          layout
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-auto flex items-center z-50 origin-top",
            isCompact
              ? "absolute top-10 mx-auto max-w-fit rounded-full border border-white/20 bg-white/5 px-2 py-1.5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-2xl backdrop-saturate-200 text-ink-900 justify-center gap-2"
              : "absolute top-0 inset-x-0 border-b border-white/10 bg-white/5 backdrop-blur-2xl backdrop-saturate-200 py-6 px-6 md:px-10 text-ink-900 justify-between w-full"
          )}
          animate={{ borderRadius: isCompact ? 40 : 0 }}
        >
          <AnimatePresence mode="wait">
            {!isCompact ? (
              <motion.div
                key="full-nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between w-full min-w-max"
              >
                {/* Desktop Left Nav */}
                <DropdownMenu setActive={setActiveLeft} className="hidden md:flex items-center space-x-12">
                  <MenuItem setActive={setActiveLeft} active={activeLeft} item="Stays" href="/stays">
                    <div className="flex flex-col">
                      <ProductItem
                        title="Grove Pavilions"
                        description="Set back amongst the indigenous coastal forest."
                        href="/stays"
                        src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=400&h=300"
                      />
                      <div className="w-full h-px bg-ink-900/10"></div>
                      <ProductItem
                        title="Pool Villas"
                        description="Positioned steps from the sand with direct beach access."
                        href="/stays"
                        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400&h=300"
                      />
                    </div>
                  </MenuItem>
                  <MenuItem setActive={setActiveLeft} active={activeLeft} item="Dining" href="/dining">
                    <div className="flex flex-col">
                      <ProductItem
                        title="The Shore Kitchen"
                        description="Contemporary Filipino coastal cuisine served against the rhythm of the Sulu Sea."
                        href="/dining"
                        src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=400&h=300"
                      />
                    </div>
                  </MenuItem>
                  <MenuItem setActive={setActiveLeft} active={activeLeft} item="Wellness" href="/wellness">
                    <div className="flex flex-col">
                      <ProductItem
                        title="The Sanctuary"
                        description="Restorative treatments drawing from local botanicals."
                        href="/wellness"
                        src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400&h=300"
                      />
                    </div>
                  </MenuItem>
                </DropdownMenu>

                <div className="md:absolute md:left-1/2 md:-translate-x-1/2 relative z-10">
                  <Link to="/" className="text-2xl font-serif tracking-[0.3em] uppercase whitespace-nowrap">
                    Dalisara
                  </Link>
                </div>

                {/* Desktop Right Nav */}
                <div className="hidden md:flex items-center space-x-12 relative z-10">
                  <DropdownMenu setActive={setActiveRight} className="flex items-center space-x-12">
                    <MenuItem setActive={setActiveRight} active={activeRight} item="Experiences" href="/experiences">
                      <div className="flex flex-col">
                        <ProductItem
                          title="Marine Expeditions"
                          description="Guided half-day snorkeling and marine exploration."
                          href="/experiences"
                          src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=400&h=300"
                        />
                        <HoveredLink to="/experiences">All Experiences</HoveredLink>
                      </div>
                    </MenuItem>
                    <MenuItem setActive={setActiveRight} active={activeRight} item="Destination" href="/location">
                      <div className="flex flex-col min-w-[200px]">
                        <HoveredLink to="/location">Getting Here</HoveredLink>
                        <HoveredLink to="/about">Our Philosophy</HoveredLink>
                        <HoveredLink to="/contact">Contact</HoveredLink>
                      </div>
                    </MenuItem>
                  </DropdownMenu>
                  
                  <TouchRippleButton
                    onClick={() => setBookingModalOpen(true)}
                    className="px-6 py-2 border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-sand-50 dark:border-white/40 dark:text-[#FCFAF5] dark:hover:bg-[#FBF8F0] dark:hover:text-[#080A08] rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap font-medium text-center"
                  >
                    Reserve
                  </TouchRippleButton>
                </div>

                {/* Mobile Menu Toggle */}
                <TouchRippleButton
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  className="md:hidden relative z-10 p-2.5 -mr-2 rounded-full text-ink-900 hover:bg-ink-900/5 transition-colors focus:outline-none"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <motion.div
                    key={mobileMenuOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.div>
                </TouchRippleButton>
              </motion.div>
            ) : (
              <motion.div
                key="compact-nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 min-w-max"
              >
                <div className="flex items-center gap-1 hidden md:flex">
                  {NAV_LINKS.map((navItem, idx) => (
                    <Link
                      key={`link-${idx}`}
                      to={navItem.href}
                      className="relative flex items-center gap-1 rounded-full px-4 py-2 text-xs uppercase tracking-widest font-medium text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-ink-900 whitespace-nowrap"
                    >
                      <span>{navItem.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="flex md:hidden items-center px-3 py-1.5">
                  <Link to="/" className="text-sm font-serif tracking-[0.3em] uppercase whitespace-nowrap">
                    Dalisara
                  </Link>
                </div>

                <div className="h-5 w-px bg-ink-900/20 hidden md:block" />

                <div className="flex items-center gap-1.5">
                  <TouchRippleButton
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden p-2 rounded-full hover:bg-ink-900/5 text-ink-900 transition-colors focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </TouchRippleButton>
                  <TouchRippleButton
                    onClick={() => setBookingModalOpen(true)}
                    className="px-5 py-2 bg-ink-900 text-sand-50 rounded-full text-xs uppercase tracking-widest hover:bg-ink-800 transition-colors whitespace-nowrap font-semibold text-center shadow-sm block"
                  >
                    Book Now
                  </TouchRippleButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-sand-100/98 dark:bg-[#070908]/98 backdrop-blur-2xl flex flex-col pt-28 px-6 pb-8 overflow-y-auto"
          >
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.05,
                  },
                },
              }}
              className="flex flex-col gap-2 my-auto"
            >
              {NAV_LINKS.map((link, idx) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      show: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TouchRippleLink
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "group w-full py-4 px-4 rounded-2xl flex items-center justify-between border-b border-ink-900/10 dark:border-white/10 transition-colors",
                        isActive
                          ? "bg-ink-900/5 dark:bg-white/10 text-ink-900 dark:text-[#FCFAF5]"
                          : "hover:bg-ink-900/[0.03] dark:hover:bg-white/[0.04] text-ink-900/90 dark:text-[#EDE8DE]"
                      )}
                    >
                      <div className="flex items-baseline space-x-4">
                        <span className="text-[11px] font-mono tracking-widest text-ink-400 dark:text-[#A8A398] opacity-70">
                          0{idx + 1}
                        </span>
                        <div>
                          <span className="text-2xl font-serif tracking-tight block group-hover:translate-x-1 transition-transform duration-300">
                            {link.label}
                          </span>
                          <span className="text-[11px] uppercase tracking-wider text-ink-700 dark:text-[#CFC9BE] opacity-60 block mt-0.5">
                            {link.sub}
                          </span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-ink-900/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-4 h-4 text-ink-900 dark:text-[#FCFAF5]" />
                      </div>
                    </TouchRippleLink>
                  </motion.div>
                );
              })}

              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="pt-4 mt-2"
              >
                <TouchRippleButton
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setBookingModalOpen(true);
                  }}
                  className="w-full py-4 px-6 bg-ink-900 text-sand-50 rounded-2xl text-xs uppercase tracking-[0.25em] font-semibold text-center block shadow-lg hover:bg-ink-800 transition-colors"
                >
                  Reserve Your Stay
                </TouchRippleButton>
              </motion.div>
            </motion.nav>

            {/* Mobile Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="pt-6 border-t border-ink-900/10 dark:border-white/10 flex flex-wrap justify-between items-center text-[10px] uppercase tracking-widest text-ink-700 dark:text-[#A8A398] gap-4"
            >
              <div className="flex gap-4">
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-ink-900 dark:hover:text-white transition-colors">Philosophy</Link>
                <Link to="/location" onClick={() => setMobileMenuOpen(false)} className="hover:text-ink-900 dark:hover:text-white transition-colors">Location</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-ink-900 dark:hover:text-white transition-colors">Contact</Link>
              </div>
              <span className="opacity-50">San Vicente, Palawan</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-grow flex flex-col outline-none" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <ThemeToggle />
      <GuestConcierge />
    </div>
  );
}
