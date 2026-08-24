import { memo } from 'react';
import { AnimatedTooltip, TooltipItem } from '../components/AnimatedTooltip';
import { Compass } from 'lucide-react';
import { SEO } from '../components/SEO';

const sanctuaryCustodians: TooltipItem[] = [
  {
    id: 1,
    name: 'Diwa Soriano',
    designation: 'Head Botanist & Naturalist',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 2,
    name: 'Mateo Alcantara',
    designation: 'Principal Architectural Custodian',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 3,
    name: 'Chef Elena Ramos',
    designation: 'Culinary Director — The Shore Kitchen',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 4,
    name: 'Captain Rafael Cruz',
    designation: 'Master Navigator & Marine Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 5,
    name: 'Isla Valenzuela',
    designation: 'Lead Wellness Therapist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

export const About = memo(function About() {
  return (
    <div className="bg-sand-100 min-h-screen pt-40 pb-32">
      <SEO 
        title="Heritage, Architecture & Living Design | Dalisara"
        description="Conceived as a response to the pace of modern travel. Learn the architectural principles and custodial philosophy of Dalisara."
        canonical="/about"
      />
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-8">Our Place &amp; Heritage</div>
        <h1 className="font-serif text-6xl md:text-[80px] leading-none tracking-tighter italic text-ink-900 mb-16">The Slower Measure</h1>
        
        <div className="prose prose-lg mx-auto text-left text-ink-700 space-y-8 opacity-90">
          <p>
            Dalisara was conceived as a response to the pace of modern travel. Rather than 
            curating endless activity, we chose to curate space. We believe that true luxury 
            lies in the absence of urgency.
          </p>
          <p>
            Located on a fictional west-facing property within the San Vicente context of Palawan, the architecture defers entirely 
            to the landscape. Structures are predominantly single-level, built using local hardwoods, woven textiles, and 
            stone, designed to age gracefully alongside the surrounding coastal forest.
          </p>
          <p>
            Our hospitality is high-touch but relaxed. We anticipate what is needed without unnecessary ceremony, 
            allowing you the quiet required to settle into the rhythm of the coast.
          </p>
          
          <div className="my-16 border-l border-ink-900/20 pl-8 italic font-serif text-3xl tracking-tight text-ink-900">
            &ldquo;We built Dalisara not to escape the world, but to find a clearer vantage point.&rdquo;
          </div>

          {/* Interactive Custodians Section with AnimatedTooltip */}
          <div className="my-16 p-8 md:p-10 rounded-3xl bg-sand-50 dark:bg-white/[0.03] border border-ink-900/10 dark:border-white/10 not-prose flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-500 mb-2">
                <Compass className="w-3.5 h-3.5 text-ink-900 dark:text-sand-50" />
                <span>Sanctuary Custodians</span>
              </div>
              <h3 className="font-serif text-2xl italic tracking-tight text-ink-900 dark:text-sand-50 mb-2">
                Curators of the Coast
              </h3>
              <p className="text-xs text-ink-700 dark:text-[#CFC9BE] leading-relaxed">
                Meet the resident naturalists, master artisans, and culinary leads who steward the Dalisara estate. Hover over each profile to reveal their craft.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <AnimatedTooltip items={sanctuaryCustodians} />
              <span className="text-[10px] uppercase tracking-widest text-ink-400 dark:text-[#A8A398] font-mono">
                5 Resident Stewards
              </span>
            </div>
          </div>

          <p className="text-xs tracking-wide text-ink-500 bg-sand-200 p-4 border border-ink-900/10">
            <strong>Project Note / Concept Disclosure:</strong> Dalisara is a fictional resort concept. This website is a portfolio simulation built to demonstrate maximum presentation realism within a fictional-integrity boundary. There is no real reservation created, no payment processed, no real inventory queried, and no hotel enquiry delivered.
          </p>
        </div>
      </div>
    </div>
  );
});


