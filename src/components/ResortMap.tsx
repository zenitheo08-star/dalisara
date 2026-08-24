import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Compass, Footprints, Wind, Mountain, Eye, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { LazyImage } from './LazyImage';

export interface ZonePOI {
  id: string;
  x: number;
  y: number;
  title: string;
  category: 'Arrival & Reception' | 'Accommodation' | 'Culinary & Social' | 'Restoration' | 'Beachfront';
  description: string;
  architecturalNote: string;
  elevation: string;
  walkTime: string;
  sunlightMode: 'Morning Filtered' | 'Midday Canopy' | 'Golden Hour' | 'Twilight Breeze';
  image: string;
  features: string[];
}

const pois: ZonePOI[] = [
  {
    id: 'arrival',
    x: 180,
    y: 400,
    title: 'Arrival Grove',
    category: 'Arrival & Reception',
    description: 'A shaded inland approach featuring a discreet vehicle court, open timber arrival pavilion, and welcoming cold-pressed kalamansi infusions.',
    architecturalNote: 'Post-and-beam ipil timbers integrated with native bamboo slats to let cooling northeast inland breezes circulate continuously.',
    elevation: '+14m above sea level (Inland Ridge)',
    walkTime: '4 min walk to Social Heart',
    sunlightMode: 'Morning Filtered',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800&h=600',
    features: ['Discreet Vehicle Drop-off', 'Reception Veranda', 'Luggage Valet', 'Herbal Welcome Bar']
  },
  {
    id: 'grove',
    x: 350,
    y: 400,
    title: 'Grove Quarter',
    category: 'Accommodation',
    description: 'The calmest, most inward accommodation zone featuring shaded garden paths, secluded pavilions, outdoor soaking tubs, and deep jungle canopy.',
    architecturalNote: 'Elevated stilt foundations minimize root disturbance to centuries-old coastal mahogany and wild fig groves.',
    elevation: '+9m above sea level (Forest Floor)',
    walkTime: '3 min walk to Shore Line',
    sunlightMode: 'Midday Canopy',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800&h=600',
    features: ['Grove Pavilions 01–08', 'Private Outdoor Soaking Tubs', 'Reading Decks', 'Native Botanical Gardens']
  },
  {
    id: 'social',
    x: 520,
    y: 350,
    title: 'Social Heart',
    category: 'Culinary & Social',
    description: 'The central coastal garden, home to The Shore Kitchen, Canopy Bar, infinity fresh-water pool deck, and open hearth fires.',
    architecturalNote: 'Open-air thatched roofs crafted from treated nipa and reclaimed teak, oriented towards the western sunset vector.',
    elevation: '+4m above sea level (Mid-Dune Terrace)',
    walkTime: 'Central Hub (1–3 min anywhere)',
    sunlightMode: 'Golden Hour',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800&h=600',
    features: ['The Shore Kitchen', 'Canopy Cocktail Bar', 'Main Infinity Pool', 'Evening Fire Pit']
  },
  {
    id: 'wellness',
    x: 450,
    y: 180,
    title: 'Quiet North',
    category: 'Restoration',
    description: 'A serene northern enclave housing the Botanical Wellness House, steam sanctum, open-air yoga pavilion, and herbal distillation garden.',
    architecturalNote: 'Acoustically isolated by a natural dense palm berm; designed with raw volcanic stone basins and river-stone paths.',
    elevation: '+7m above sea level (Northern Bluff)',
    walkTime: '5 min walk from Shore Line',
    sunlightMode: 'Morning Filtered',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800&h=600',
    features: ['The Sanctuary Spa', 'Movement & Yoga Shala', 'Herbal Steam Room', 'Meditation Glade']
  },
  {
    id: 'shore',
    x: 750,
    y: 420,
    title: 'Shore Line',
    category: 'Beachfront',
    description: 'The western coastal band along San Vicente Long Beach, featuring direct sand access, beachfront daybeds, and our Marine Expeditions boat launch.',
    architecturalNote: 'Set back 40 meters from the mean high-water mark behind native beach morning glories and coconut palms to preserve natural dune geometry.',
    elevation: '+1.5m above sea level (Dune Crest)',
    walkTime: 'Direct beach access (0 min)',
    sunlightMode: 'Twilight Breeze',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800&h=600',
    features: ['Beachfront Daybeds', 'Direct Sulu Sea Access', 'Marine Outpost & Kayaks', 'Sunset Viewing Lawn']
  }
];

const MapContours = memo(function MapContours({ showElevation }: { showElevation: boolean }) {
  return (
    <>
      <path d="M-100,500 Q 200,350 600,200 T 1100,50" fill="none" stroke="currentColor" strokeWidth={showElevation ? "2" : "1"} className={cn("transition-opacity", showElevation ? "opacity-30" : "opacity-10")} />
      <path d="M-100,550 Q 250,400 650,250 T 1100,100" fill="none" stroke="currentColor" strokeWidth={showElevation ? "2" : "1"} className={cn("transition-opacity", showElevation ? "opacity-30" : "opacity-10")} />
      <path d="M-100,600 Q 300,450 700,300 T 1100,150" fill="none" stroke="currentColor" strokeWidth={showElevation ? "2" : "1"} className={cn("transition-opacity", showElevation ? "opacity-30" : "opacity-10")} />
      <path d="M-100,650 Q 350,500 750,350 T 1100,200" fill="none" stroke="currentColor" strokeWidth={showElevation ? "2" : "1"} className={cn("transition-opacity", showElevation ? "opacity-30" : "opacity-10")} />
      <path d="M 120,320 Q 250,300 420,380 T 360,520 Z" fill="currentColor" className="opacity-[0.04]" />
      <path d="M 380,120 Q 520,100 580,240 T 400,280 Z" fill="currentColor" className="opacity-[0.04]" />
      <path d="M 180,400 L 350,400 L 520,350 L 750,420" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" className="opacity-25" />
      <path d="M 350,400 L 450,180 L 520,350" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" className="opacity-25" />
      <path d="M 680,600 Q 750,300 860,0" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" className="opacity-35" />
      <text x="880" y="320" className="text-[11px] uppercase tracking-[0.3em] font-mono opacity-40 -rotate-90" fill="currentColor">
        Sulu Sea / Long Beach
      </text>
      <g transform="translate(80, 80)" className="opacity-40 pointer-events-none">
        <circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <line x1="0" y1="-28" x2="0" y2="28" stroke="currentColor" strokeWidth="0.8" />
        <line x1="-28" y1="0" x2="28" y2="0" stroke="currentColor" strokeWidth="0.8" />
        <text x="0" y="-32" textAnchor="middle" className="text-[8px] font-mono uppercase" fill="currentColor">N (Amihan Winds)</text>
        <text x="36" y="3" textAnchor="start" className="text-[8px] font-mono uppercase" fill="currentColor">E</text>
      </g>
    </>
  );
});

const MapMarker = memo(function MapMarker({
  poi,
  isActive,
  showElevation,
  onSelect,
  onHover,
  onLeave,
}: {
  poi: ZonePOI;
  isActive: boolean;
  showElevation: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  return (
    <g 
      className="cursor-pointer transition-transform duration-300"
      style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transformOrigin: `${poi.x}px ${poi.y}px` }}
      onClick={() => onSelect(poi.id)}
      onMouseEnter={() => onHover(poi.id)}
      onMouseLeave={onLeave}
    >
      {isActive && (
        <motion.circle
          cx={poi.x}
          cy={poi.y}
          r="22"
          fill="currentColor"
          initial={{ opacity: 0.6, scale: 0.4 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          className="opacity-30 text-ink-900"
        />
      )}

      <circle
        cx={poi.x}
        cy={poi.y}
        r={isActive ? 12 : 8}
        fill={isActive ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        className={cn(
          "transition-all duration-300",
          isActive ? "text-ink-900" : "text-ink-700 opacity-60"
        )}
      />

      <circle
        cx={poi.x}
        cy={poi.y}
        r={isActive ? 4 : 2.5}
        fill={isActive ? "#FBF8F0" : "currentColor"}
        className="transition-all duration-300"
      />
      
      <circle
        cx={poi.x}
        cy={poi.y}
        r="40"
        fill="transparent"
      />
      
      <text
        x={poi.x}
        y={poi.y - 18}
        textAnchor="middle"
        className={cn(
          "text-[10px] uppercase font-mono tracking-[0.2em] transition-all duration-300 font-semibold",
          isActive ? "opacity-100 fill-ink-900" : "opacity-60 fill-ink-700"
        )}
      >
        {poi.title}
      </text>

      {showElevation && (
        <text
          x={poi.x}
          y={poi.y + 24}
          textAnchor="middle"
          className="text-[8px] font-mono tracking-wider fill-ink-600 opacity-80"
        >
          {poi.elevation.split(' ')[0]}
        </text>
      )}
    </g>
  );
});

const ZoneInspector = memo(function ZoneInspector({ currentPoi }: { currentPoi: ZonePOI }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPoi.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-sand-200 border border-ink-900/10">
          <LazyImage
            src={currentPoi.image}
            alt={currentPoi.title}
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 z-10 px-2.5 py-1 bg-sand-50/90 backdrop-blur-md rounded-full text-[9px] uppercase tracking-widest font-mono text-ink-800 font-semibold border border-ink-900/10">
            {currentPoi.category}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-ink-500 uppercase tracking-widest mb-1">
            <span>Zone Specification</span>
            <span>{currentPoi.elevation}</span>
          </div>
          <h3 className="font-serif text-2xl italic text-ink-900 leading-tight">
            {currentPoi.title}
          </h3>
        </div>

        <p className="text-xs text-ink-700 leading-relaxed">
          {currentPoi.description}
        </p>

        <div className="p-3 bg-sand-100 rounded-xl border border-ink-900/5 space-y-1">
          <div className="text-[10px] uppercase font-mono tracking-wider text-ink-500 font-semibold flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-ink-700" />
            <span>Architectural Canon</span>
          </div>
          <p className="text-xs italic text-ink-800">
            "{currentPoi.architecturalNote}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2.5 bg-sand-200/50 rounded-lg flex items-center gap-2">
            <Footprints className="w-4 h-4 text-ink-600 shrink-0" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-ink-500 block font-mono">Pace</span>
              <span className="font-medium text-ink-900 text-[11px]">{currentPoi.walkTime}</span>
            </div>
          </div>
          <div className="p-2.5 bg-sand-200/50 rounded-lg flex items-center gap-2">
            <Wind className="w-4 h-4 text-ink-600 shrink-0" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-ink-500 block font-mono">Microclimate</span>
              <span className="font-medium text-ink-900 text-[11px]">{currentPoi.sunlightMode}</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-ink-500 block mb-2 font-semibold">
            Estate Facilities & Anchors
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentPoi.features.map((feat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-sand-200/70 text-ink-800 rounded-lg text-[11px]"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export const ResortMap = memo(function ResortMap() {
  const [selectedPoiId, setSelectedPoiId] = useState<string>('social');
  const [hoveredPoiId, setHoveredPoiId] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'golden' | 'night'>('golden');
  const [showElevation, setShowElevation] = useState(false);

  const handleSelectPoi = useCallback((id: string) => {
    setSelectedPoiId(id);
  }, []);

  const handleHoverPoi = useCallback((id: string) => {
    setHoveredPoiId(id);
  }, []);

  const handleLeavePoi = useCallback(() => {
    setHoveredPoiId(null);
  }, []);

  const toggleElevation = useCallback(() => {
    setShowElevation((prev) => !prev);
  }, []);

  const currentPoi = useMemo(() => {
    return pois.find(p => p.id === (hoveredPoiId || selectedPoiId)) || pois[2];
  }, [hoveredPoiId, selectedPoiId]);

  return (
    <div className="space-y-6">
      {/* Map Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-sand-50 rounded-2xl border border-ink-900/10">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-ink-600" />
          <span className="text-xs uppercase tracking-widest font-mono text-ink-800">
            Estate Map & Zones
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand-200 text-ink-700 font-mono">
            5 Master Zones
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Time of Day Lighting Filter */}
          <div className="flex items-center bg-sand-200/80 rounded-xl p-1 gap-1">
            <button
              onClick={() => setTimeOfDay('day')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all",
                timeOfDay === 'day' ? "bg-sand-50 text-ink-900 shadow-sm font-semibold" : "text-ink-600 hover:text-ink-900"
              )}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Daylight</span>
            </button>
            <button
              onClick={() => setTimeOfDay('golden')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all",
                timeOfDay === 'golden' ? "bg-amber-100 text-amber-900 shadow-sm font-semibold" : "text-ink-600 hover:text-ink-900"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Golden Hour</span>
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all",
                timeOfDay === 'night' ? "bg-ink-900 text-sand-50 shadow-sm font-semibold" : "text-ink-600 hover:text-ink-900"
              )}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Starlight</span>
            </button>
          </div>

          {/* Elevation Toggle */}
          <button
            onClick={toggleElevation}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all",
              showElevation 
                ? "bg-ink-900 text-sand-50 border-ink-900" 
                : "bg-sand-50 text-ink-700 border-ink-900/10 hover:border-ink-900/30"
            )}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>{showElevation ? 'Topography: Active' : 'Topography'}</span>
          </button>
        </div>
      </div>

      {/* Main Map & Interactive Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Vector Interactive Map */}
        <div className="lg:col-span-8 relative aspect-[4/3] md:aspect-[16/10] bg-sand-200 rounded-2xl overflow-hidden border border-ink-900/10 shadow-inner group">
          
          {/* Lighting Overlay */}
          <div 
            className={cn(
              "absolute inset-0 transition-all duration-700 pointer-events-none z-0",
              timeOfDay === 'day' && "bg-amber-50/20",
              timeOfDay === 'golden' && "bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent",
              timeOfDay === 'night' && "bg-ink-950/40 mix-blend-multiply"
            )}
          />

          {/* Abstract SVG Map Graphic */}
          <svg
            viewBox="0 0 1000 600"
            className="absolute inset-0 w-full h-full object-cover text-ink-900 z-10"
            preserveAspectRatio="xMidYMid slice"
          >
            <MapContours showElevation={showElevation} />

            {/* POI Markers */}
            {pois.map((poi) => {
              const isSelected = selectedPoiId === poi.id;
              const isHovered = hoveredPoiId === poi.id;
              const isActive = isSelected || isHovered;

              return (
                <MapMarker
                  key={poi.id}
                  poi={poi}
                  isActive={isActive}
                  showElevation={showElevation}
                  onSelect={handleSelectPoi}
                  onHover={handleHoverPoi}
                  onLeave={handleLeavePoi}
                />
              );
            })}
          </svg>

          {/* Bottom quick zone selector bar inside map */}
          <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap gap-1.5 justify-center pointer-events-auto">
            {pois.map((poi) => (
              <button
                key={poi.id}
                onClick={() => handleSelectPoi(poi.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-mono transition-all backdrop-blur-md border",
                  selectedPoiId === poi.id 
                    ? "bg-ink-900 text-sand-50 border-ink-900 shadow-md font-semibold" 
                    : "bg-sand-50/80 text-ink-800 border-ink-900/10 hover:bg-sand-50"
                )}
              >
                {poi.title}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Architectural Zone Inspector Drawer */}
        <div className="lg:col-span-4 bg-sand-50 rounded-2xl border border-ink-900/10 p-6 flex flex-col justify-between shadow-sm min-h-[460px]">
          <ZoneInspector currentPoi={currentPoi} />
        </div>

      </div>
    </div>
  );
});


