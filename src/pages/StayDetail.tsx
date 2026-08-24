import { memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { accommodations, formatPrice } from '../data';
import { ArrowLeft, Waves } from 'lucide-react';
import { useBooking } from '../store';
import { useNavigate } from 'react-router-dom';
import { RippleDistortion } from '../components/RippleDistortion';
import { LazyImage } from '../components/LazyImage';
import { SEO } from '../components/SEO';

export const StayDetail = memo(function StayDetail() {
  const { id } = useParams();
  const stay = accommodations.find(a => a.id === id);
  const { selectAccommodation, setBookingModalOpen } = useBooking();

  if (!stay) {
    return <div className="pt-32 px-6 text-center">Accommodation not found.</div>;
  }

  const handleBook = () => {
    selectAccommodation(stay.id);
    setBookingModalOpen(true);
  };

  return (
    <div className="bg-sand-100 min-h-screen">
      <SEO 
        title={`${stay.name} | Dalisara`}
        description={`${stay.description} ${stay.size} sanctuary accommodating ${stay.occupancy}.`}
        ogImage={stay.images[0]}
        canonical={`/stays/${stay.id}`}
      />
      <section className="h-[70vh] w-full relative bg-sand-200 dark:bg-ink-950 overflow-hidden">
        {stay.id.includes('pool') || stay.id === 'dalisara-house' || stay.id === 'shore-pavilion' ? (
          <RippleDistortion 
            src={stay.images[0]} 
            brushSize={150}
            strength={0.22}
            swirl={1.1}
            rings={4}
            spread={4.5}
            fade={2.8}
            spacing={14}
            dispersion={0.025}
            glint={0.35}
            tint="#0d9488"
            tintAmount={0.06}
            grayscale={false}
            trigger="hover"
            quality="high"
            className="w-full h-full cursor-crosshair"
          />
        ) : (
          <LazyImage 
            src={stay.images[0]} 
            alt={stay.name} 
            rootMargin="400px 0px"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-ink-900/10 pointer-events-none" />
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <Link to="/stays" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-ink-900 hover:opacity-60 transition-opacity mb-16 opacity-60">
          <ArrowLeft size={14} /> Back to Selections
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-8">
            <h1 className="font-serif text-5xl md:text-[80px] leading-none tracking-tighter italic text-ink-900 mb-8">{stay.name}</h1>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.4em] opacity-60 border-y border-ink-900/10 py-6 mb-12">
              <div>{stay.size}</div>
              <div>{stay.occupancy}</div>
              <div>{stay.bed}</div>
            </div>
            
            <p className="text-xl text-ink-700 leading-relaxed mb-16 opacity-90">
              {stay.description}
            </p>

            <h3 className="font-serif text-3xl italic tracking-tight text-ink-900 mb-8">Amenities & Details</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-ink-700 text-sm opacity-90">
              {stay.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-ink-900/40" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="sticky top-32 bg-sand-50 p-8 border border-ink-900/10 shadow-sm">
              <div className="text-[10px] uppercase tracking-[0.4em] text-ink-900 opacity-60 mb-2">Starting from</div>
              <div className="text-3xl text-ink-900 mb-8">{formatPrice(stay.price)} <span className="text-[10px] text-ink-900 opacity-60 uppercase tracking-[0.2em]">/ night</span></div>
              
              <button 
                onClick={handleBook}
                className="w-full py-4 bg-ink-900 text-sand-50 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-ink-800 transition-colors mb-6"
              >
                Reserve this stay
              </button>
              
              <p className="text-[10px] uppercase tracking-widest text-ink-900 opacity-40 leading-relaxed">
                Rates are fictional and subject to change. All reservations are simulated for demonstration purposes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-24 bg-sand-200 dark:bg-ink-950 px-6 md:px-12 border-t border-ink-900/10 dark:border-white/10">
         <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] uppercase tracking-[0.35em] text-ink-500 dark:text-sand-200">
                Architectural Details &amp; Plunge Waters
              </span>
              <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-ink-400 dark:text-sand-300">
                <Waves size={12} className="text-teal-600 dark:text-teal-400" />
                <span>Move cursor over pool view to ripple water</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stay.images.slice(1).map((img, i) => {
                const isWaterImage = (stay.id.includes('pool') && i === 0) || stay.id === 'dalisara-house';
                return (
                 <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand-300 dark:bg-white/5 border border-ink-900/10 dark:border-white/10 relative group">
                    {isWaterImage ? (
                      <RippleDistortion 
                        src={img}
                        brushSize={130}
                        strength={0.2}
                        swirl={1.1}
                        rings={4}
                        spread={4}
                        fade={2.6}
                        spacing={12}
                        dispersion={0.02}
                        glint={0.3}
                        tint="#0d9488"
                        tintAmount={0.06}
                        grayscale={false}
                        trigger="hover"
                        quality="medium"
                        className="w-full h-full cursor-crosshair"
                      />
                    ) : (
                      <LazyImage 
                        src={img} 
                        alt={`${stay.name} interior detail`} 
                        rootMargin="250px 0px"
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                    )}
                 </div>
                );
              })}
            </div>
         </div>
      </section>
    </div>
  );
});

