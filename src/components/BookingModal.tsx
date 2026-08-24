import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, ArrowRight, Home } from 'lucide-react';
import { useBooking } from '../store';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { accommodations, formatPrice } from '../data';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { TouchRippleButton } from './TouchRipple';

export function BookingModal() {
  const { state, setBookingModalOpen, setDates, selectAccommodation } = useBooking();
  const [step, setStep] = useState<'dates' | 'rooms'>('dates');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (state.isBookingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset step after closing
      setTimeout(() => setStep('dates'), 300);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isBookingModalOpen]);

  const handleSelect = (range: any) => {
    setDates({ from: range?.from, to: range?.to });
  };

  if (!state.isBookingModalOpen) return null;

  return (
    <AnimatePresence>
      {state.isBookingModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Glassmorphic Backdrop */}
          <div 
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-xl"
            onClick={() => setBookingModalOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative w-full max-w-5xl bg-sand-50/90 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-ink-900/10"
          >
            {/* Left Panel - Information / Visuals */}
            <div className="w-full md:w-5/12 bg-ink-900 text-sand-50 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200" alt="Texture" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-sand-50/60 mb-8">Reservation</h3>
                <h2 className="font-serif text-4xl italic tracking-tight leading-snug mb-6">
                  {step === 'dates' ? 'Select your horizon.' : 'Choose your sanctuary.'}
                </h2>
                <p className="text-sm opacity-80 leading-relaxed font-light">
                  {step === 'dates' 
                    ? "Dalisara operates on a quiet rhythm. We invite you to choose your dates of arrival and departure. A minimum stay of 2 nights is gently recommended."
                    : "Each pavilion and villa offers a distinct perspective of the coast and canopy. Select the space that resonates with your intended rhythm."}
                </p>
              </div>
              
              <div className="relative z-10 mt-12 md:mt-0">
                {step === 'dates' && state.dates.from && state.dates.to && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col space-y-2">
                     <span className="text-[10px] uppercase tracking-widest opacity-50">Selected Journey</span>
                     <span className="font-serif italic text-xl">
                       {format(state.dates.from, 'MMM d')} &mdash; {format(state.dates.to, 'MMM d, yyyy')}
                     </span>
                   </motion.div>
                )}
                {step === 'rooms' && state.selectedAccommodationId && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col space-y-2">
                     <span className="text-[10px] uppercase tracking-widest opacity-50">Selected Sanctuary</span>
                     <span className="font-serif italic text-xl">
                       {accommodations.find(a => a.id === state.selectedAccommodationId)?.name}
                     </span>
                   </motion.div>
                )}
              </div>
            </div>

            {/* Right Panel - Interactive Area */}
            <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col">
              <button 
                onClick={() => setBookingModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-ink-900/5 text-ink-900 transition-colors z-20"
              >
                <X size={20} />
              </button>

              <div className="flex-grow flex flex-col">
                <AnimatePresence mode="wait">
                  {step === 'dates' ? (
                    <motion.div 
                      key="dates"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-grow flex flex-col items-center justify-center"
                    >
                      <div className="calendar-container scale-90 md:scale-100 origin-center">
                        <DayPicker
                          mode="range"
                          selected={{ from: state.dates.from, to: state.dates.to }}
                          onSelect={handleSelect}
                          numberOfMonths={2}
                          pagedNavigation
                          disabled={{ before: new Date() }}
                          classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-8 sm:space-y-0",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center mb-6",
                            caption_label: "text-sm font-serif italic text-ink-900 font-bold",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center text-ink-900",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-ink-400 rounded-md w-9 font-normal text-[10px] uppercase tracking-widest",
                            row: "flex w-full mt-2",
                            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-ink-900/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 transition-colors",
                            day: "h-9 w-9 p-0 font-normal hover:bg-ink-900/10 rounded-md transition-colors text-ink-900 flex items-center justify-center",
                            day_selected: "!bg-ink-900 !text-sand-50 hover:!bg-ink-800 hover:!text-white font-medium",
                            day_today: "font-semibold underline decoration-ink-900/30 underline-offset-4",
                            day_outside: "text-ink-400 opacity-50",
                            day_disabled: "text-ink-400 opacity-50 line-through",
                            day_range_middle: "aria-selected:!bg-ink-900/10 aria-selected:!text-ink-900 rounded-none",
                            day_hidden: "invisible",
                          }}
                        />
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-ink-900/10 w-full flex justify-end">
                        <TouchRippleButton 
                          onClick={() => setStep('rooms')}
                          disabled={!state.dates.from || !state.dates.to}
                          className={cn(
                            "px-8 py-3 bg-ink-900 text-sand-50 rounded-full text-xs uppercase tracking-widest transition-all flex items-center gap-3",
                            (!state.dates.from || !state.dates.to) ? "opacity-40 cursor-not-allowed" : "hover:bg-ink-800 hover:shadow-lg hover:-translate-y-0.5"
                          )}
                        >
                          Continue to Stays <ArrowRight size={14} />
                        </TouchRippleButton>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="rooms"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-grow flex flex-col"
                    >
                      <div className="flex-grow overflow-y-auto pr-2 pb-8 space-y-4 max-h-[60vh] custom-scrollbar">
                        {accommodations.map((acc) => (
                          <div 
                            key={acc.id}
                            onClick={() => selectAccommodation(acc.id)}
                            className={cn(
                              "p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row gap-4 group",
                              state.selectedAccommodationId === acc.id 
                                ? "border-ink-900 bg-ink-900/5 shadow-md" 
                                : "border-ink-900/10 hover:border-ink-900/30 hover:bg-ink-900/5"
                            )}
                          >
                            <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-sand-200">
                              <img src={acc.images[0]} alt={acc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply opacity-90 grayscale" />
                            </div>
                            <div className="flex-grow flex flex-col justify-center">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-serif italic text-lg text-ink-900">{acc.name}</h4>
                                <span className="text-sm font-medium">{formatPrice(acc.price)} <span className="text-[10px] text-ink-400 font-normal uppercase">/ night</span></span>
                              </div>
                              <p className="text-xs text-ink-700 line-clamp-2 leading-relaxed mb-3">{acc.description}</p>
                              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-ink-400">
                                <span className="flex items-center gap-1"><Home size={10} /> {acc.size}</span>
                                <span>&bull;</span>
                                <span>{acc.occupancy}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-ink-900/10 w-full flex justify-between items-center bg-sand-50/95 sticky bottom-0">
                        <button 
                          onClick={() => setStep('dates')}
                          className="text-xs font-medium uppercase tracking-widest text-ink-700 hover:text-ink-900 transition-colors"
                        >
                          Back to Dates
                        </button>
                        <TouchRippleButton 
                          onClick={() => {
                            setBookingModalOpen(false);
                            // Normally this would submit the booking or go to checkout
                            alert("Booking simulation complete! Your sanctuary awaits.");
                          }}
                          disabled={!state.selectedAccommodationId}
                          className={cn(
                            "px-8 py-3 bg-ink-900 text-sand-50 rounded-full text-xs uppercase tracking-widest transition-all flex items-center gap-3",
                            !state.selectedAccommodationId ? "opacity-40 cursor-not-allowed" : "hover:bg-ink-800 hover:shadow-lg hover:-translate-y-0.5"
                          )}
                        >
                          Confirm Reservation <ArrowRight size={14} />
                        </TouchRippleButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
