import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type RatePlan = 'flexible' | 'advance' | 'stayLonger';
export type TransferOption = 'none' | 'pps_standard' | 'pps_group' | 'swl_local';

export interface BookingState {
  isBookingModalOpen: boolean;
  dates: { from: Date | undefined; to: Date | undefined };
  guests: { adults: number; children: number };
  selectedAccommodationId: string | null;
  ratePlan: RatePlan;
  transferOption: TransferOption;
  transferTripType: 'roundtrip' | 'oneway';
  extras: {
    airportTransfer: boolean;
    privateDinner: boolean;
    marineExpedition: boolean;
    wellnessPackage: boolean;
  };
}

interface BookingContextType {
  state: BookingState;
  setBookingModalOpen: (open: boolean) => void;
  setDates: (dates: { from: Date | undefined; to: Date | undefined }) => void;
  setGuests: (guests: { adults: number; children: number }) => void;
  selectAccommodation: (id: string | null) => void;
  setRatePlan: (plan: RatePlan) => void;
  setTransferOption: (option: TransferOption) => void;
  setTransferTripType: (tripType: 'roundtrip' | 'oneway') => void;
  toggleExtra: (extra: keyof BookingState['extras']) => void;
  reset: () => void;
}

const initialState: BookingState = {
  isBookingModalOpen: false,
  dates: { from: undefined, to: undefined },
  guests: { adults: 2, children: 0 },
  selectedAccommodationId: null,
  ratePlan: 'flexible',
  transferOption: 'none',
  transferTripType: 'roundtrip',
  extras: {
    airportTransfer: false,
    privateDinner: false,
    marineExpedition: false,
    wellnessPackage: false,
  },
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Hydrate initial state from URL
  const [state, setState] = useState<BookingState>(() => {
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    const urlAdults = searchParams.get('adults');
    const urlChildren = searchParams.get('children');
    const urlStayId = searchParams.get('stayId');
    
    return {
      ...initialState,
      dates: {
        from: urlCheckIn && !isNaN(Date.parse(urlCheckIn)) ? new Date(urlCheckIn) : undefined,
        to: urlCheckOut && !isNaN(Date.parse(urlCheckOut)) ? new Date(urlCheckOut) : undefined,
      },
      guests: {
        adults: urlAdults ? Math.max(1, parseInt(urlAdults, 10) || 2) : 2,
        children: urlChildren ? Math.max(0, parseInt(urlChildren, 10) || 0) : 0,
      },
      selectedAccommodationId: urlStayId || null,
    };
  });

  // Sync state changes to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (state.dates.from) params.set('checkIn', state.dates.from.toISOString().split('T')[0]);
    else params.delete('checkIn');
    
    if (state.dates.to) params.set('checkOut', state.dates.to.toISOString().split('T')[0]);
    else params.delete('checkOut');
    
    params.set('adults', state.guests.adults.toString());
    params.set('children', state.guests.children.toString());
    
    if (state.selectedAccommodationId) params.set('stayId', state.selectedAccommodationId);
    else params.delete('stayId');
    
    setSearchParams(params, { replace: true });
  }, [state.dates, state.guests, state.selectedAccommodationId, setSearchParams]);

  const setBookingModalOpen = (open: boolean) => {
    setState((s) => ({ ...s, isBookingModalOpen: open }));
  };

  const setDates = (dates: { from: Date | undefined; to: Date | undefined }) => {
    setState((s) => ({ ...s, dates }));
  };

  const setGuests = (guests: { adults: number; children: number }) => {
    setState((s) => ({ ...s, guests }));
  };

  const selectAccommodation = (id: string | null) => {
    setState((s) => ({ ...s, selectedAccommodationId: id }));
  };

  const setRatePlan = (ratePlan: RatePlan) => {
    setState((s) => ({ ...s, ratePlan }));
  };

  const setTransferOption = (transferOption: TransferOption) => {
    setState((s) => ({ 
      ...s, 
      transferOption, 
      extras: { 
        ...s.extras, 
        airportTransfer: transferOption !== 'none' 
      } 
    }));
  };

  const setTransferTripType = (transferTripType: 'roundtrip' | 'oneway') => {
    setState((s) => ({ ...s, transferTripType }));
  };

  const toggleExtra = (extra: keyof BookingState['extras']) => {
    setState((s) => ({
      ...s,
      extras: { ...s.extras, [extra]: !s.extras[extra] },
    }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        setBookingModalOpen,
        setDates,
        setGuests,
        selectAccommodation,
        setRatePlan,
        setTransferOption,
        setTransferTripType,
        toggleExtra,
        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

