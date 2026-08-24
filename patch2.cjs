const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

// The replacement logic:
const currentHeaderMatch = code.match(/<motion\.header[\s\S]*?<\/motion\.header>/);
if (!currentHeaderMatch) {
  console.log("Could not find motion.header block");
  process.exit(1);
}

// We will replace the entire motion.header with a new structure
const oldHeader = currentHeaderMatch[0];

const newHeader = `
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {!isCompact ? (
            <motion.header
              key="full-header"
              layoutId="header-container"
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 inset-x-0 border-b border-ink-900/10 bg-sand-100 py-6 px-6 md:px-10 text-ink-900 pointer-events-auto flex items-center justify-between w-full"
            >
              {/* Desktop Left Nav */}
              <DropdownMenu setActive={setActiveLeft} className="hidden md:flex items-center space-x-12">
                <MenuItem setActive={setActiveLeft} active={activeLeft} item="Stays" href="/stays">
                  <div className="flex flex-col">
                    <ProductItem
                      title="Grove Pavilions"
                      description="Set back amongst the indigenous coastal forest."
                      href="/stays"
                      src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=400&h=300"
                    />
                    <div className="w-full h-px bg-ink-900/10"></div>
                    <ProductItem
                      title="Pool Villas"
                      description="Positioned steps from the sand with direct beach access."
                      href="/stays"
                      src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=400&h=300"
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
                      src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400&h=300"
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
                        title="The Outrigger"
                        description="Explore the untouched coves of San Vicente."
                        href="/experiences"
                        src="https://images.unsplash.com/photo-1537233219001-ce036dc7e35b?auto=format&fit=crop&q=80&w=400&h=300"
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
                
                <Link to="/book" className="px-6 py-2 border border-ink-900 rounded-full text-xs uppercase tracking-widest hover:bg-ink-900 hover:text-sand-50 transition-colors cursor-pointer whitespace-nowrap">
                  Reserve
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden relative z-10 p-2 -mr-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </motion.header>
          ) : (
            <motion.header
              key="compact-header"
              layoutId="header-container"
              initial={{ y: navVisible ? 0 : -100 }}
              animate={{ y: navVisible ? 0 : -100 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-10 mx-auto max-w-fit rounded-full border border-ink-900/10 bg-sand-50/80 px-2 py-1.5 shadow-xl shadow-ink-900/5 backdrop-blur-md text-ink-900 pointer-events-auto flex items-center justify-center gap-2"
            >
              <div className="flex items-center gap-1 hidden md:flex">
                {NAV_LINKS.map((navItem, idx) => (
                  <Link
                    key={\`link-\${idx}\`}
                    to={navItem.href}
                    className="relative flex items-center gap-1 rounded-full px-4 py-2 text-xs uppercase tracking-widest font-medium text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-ink-900 whitespace-nowrap"
                  >
                    <span>{navItem.label}</span>
                  </Link>
                ))}
              </div>

              <div className="flex md:hidden items-center px-4 py-2">
                <Link to="/" className="text-sm font-serif tracking-[0.3em] uppercase whitespace-nowrap">
                  Dalisara
                </Link>
              </div>

              <div className="h-5 w-px bg-ink-900/20 hidden md:block" />

              <div className="flex items-center gap-2">
                <Link 
                  to="/book"
                  className="relative rounded-full bg-ink-900 px-6 py-2 text-xs uppercase tracking-widest font-medium text-sand-50 transition-all hover:bg-ink-800 hover:shadow-lg whitespace-nowrap"
                >
                  <span>Book Now</span>
                </Link>
                <button className="md:hidden relative z-10 p-2 text-ink-900" onClick={() => setMobileMenuOpen(true)}>
                  <Menu size={20} />
                </button>
              </div>
            </motion.header>
          )}
        </AnimatePresence>
      </div>`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync('src/components/Layout.tsx', code);
