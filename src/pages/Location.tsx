import { useEffect, useState, memo } from 'react';
import { ResortMap } from '../components/ResortMap';
import { LazyImage } from '../components/LazyImage';
import { SEO } from '../components/SEO';

export const Location = memo(function Location() {
  const [weather, setWeather] = useState<{temperature?: number, condition?: string, forecast?: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.details || data.error);
          setWeather(null);
        } else {
          setWeather(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-sand-100 min-h-screen pt-40 pb-32">
      <SEO 
        title="San Vicente, Palawan & Access Logistics | Dalisara"
        description="Coordinates, private transfer pathways, and arrival logistics for Dalisara resort in San Vicente, Palawan."
        canonical="/location"
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] mb-8 opacity-40">Location</div>
            <h1 className="font-serif text-6xl md:text-[80px] leading-none tracking-tighter italic text-ink-900 mb-12">San Vicente</h1>
            
            <p className="text-sm text-ink-700 leading-relaxed mb-12 opacity-80">
              Dalisara is situated along Long Beach in San Vicente, Palawan. 
              Known for its fourteen kilometers of uninterrupted white sand, it remains 
              one of the archipelago's quietest coastal frontiers.
            </p>

            <div className="border border-ink-900/10 p-6 mb-12 flex flex-col space-y-4 bg-sand-50">
              <div className="text-[10px] uppercase tracking-[0.4em] opacity-60">Current Conditions</div>
              {loading ? (
                <div className="text-sm italic text-ink-700 opacity-60">Reading the sky...</div>
              ) : weather && weather.temperature ? (
                <div>
                  <div className="flex items-baseline space-x-4 mb-2">
                    <span className="font-serif text-4xl italic tracking-tight">{weather.temperature}°C</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-80">{weather.condition}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ink-700 opacity-60 leading-relaxed">{weather.forecast}</p>
                </div>
              ) : (
                <div className="text-sm italic text-ink-700 opacity-60">Weather information currently unavailable.</div>
              )}
            </div>

            <h3 className="font-serif text-3xl italic tracking-tight text-ink-900 mb-8">Getting Here</h3>

            <ul className="space-y-6 text-ink-700 opacity-90 text-sm">
              <li className="border-b border-ink-900/10 pb-6">
                <strong className="block text-ink-900 mb-2 uppercase tracking-[0.3em] text-[10px]">Via Puerto Princesa (Primary Gateway)</strong>
                Puerto Princesa International Airport (PPS) is the most reliable gateway. The scenic overland journey from Puerto Princesa to San Vicente takes approximately 2.5 to 4 hours, depending on weather and road conditions. 
                <br /><br />
                We offer private, air-conditioned vehicle transfers:
                <br />
                <span className="text-[10px] uppercase tracking-widest text-ink-500 block mt-2">Up to 4 guests: ₱9,500 one way</span>
                <span className="text-[10px] uppercase tracking-widest text-ink-500 block mt-1">5–8 guests: ₱13,500 one way</span>
              </li>
              <li className="border-b border-ink-900/10 pb-6">
                <strong className="block text-ink-900 mb-2 uppercase tracking-[0.3em] text-[10px]">Via San Vicente Airport</strong>
                Direct aviation to San Vicente Airport (SWL) remains highly date-sensitive. As of early 2026, some regional routes (such as Cebu Pacific's Cebu–San Vicente service) are suspended until further notice. 
                <br /><br />
                Should your travel dates align with operating regional flights, Dalisara provides local pickup:
                <br />
                <span className="text-[10px] uppercase tracking-widest text-ink-500 block mt-2">San Vicente Pickup: ₱2,500 one way per vehicle</span>
              </li>
            </ul>
          </div>
          
          <div className="aspect-[4/5] bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1200&h=1500" 
              alt="Aerial view of Palawan coast" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover grayscale mix-blend-multiply dark:mix-blend-normal opacity-90"
            />
          </div>
        </div>

        <div className="mt-32 pt-24 border-t border-ink-900/10">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] mb-4 opacity-40">The Grounds</div>
              <h2 className="font-serif text-4xl md:text-5xl italic tracking-tight text-ink-900">Resort Map</h2>
            </div>
            <p className="text-sm text-ink-700 opacity-80 mt-6 md:mt-0 max-w-sm">
              Discover the layout of our private sanctuary, from the arrival pavilion in the lush canopy down to the secluded cove.
            </p>
          </div>
          
          <ResortMap />
        </div>
      </div>
    </div>
  );
});

