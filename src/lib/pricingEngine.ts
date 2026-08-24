import { addDays, differenceInDays, format, isBefore, isAfter, subDays } from 'date-fns';
import { accommodations, formatPrice } from '../data';
import { RatePlan, TransferOption } from '../store';

export type SeasonType = 'festive' | 'high' | 'green';

export interface SeasonInfo {
  type: SeasonType;
  label: string;
  minNights: number;
  multiplier: number;
  badgeColor: string;
}

export function getSeasonForDate(date: Date): SeasonInfo {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const day = date.getDate();

  // Festive Season: 20 December – 5 January
  if ((month === 11 && day >= 20) || (month === 0 && day <= 5)) {
    return {
      type: 'festive',
      label: 'Festive Season',
      minNights: 5,
      multiplier: 1.40,
      badgeColor: 'bg-amber-900/10 text-amber-900 border-amber-900/20',
    };
  }

  // Green Season: 1 June – 31 October
  if (month >= 5 && month <= 9) {
    return {
      type: 'green',
      label: 'Green Season',
      minNights: 2,
      multiplier: 1.00,
      badgeColor: 'bg-emerald-900/10 text-emerald-900 border-emerald-900/20',
    };
  }

  // High Season: 1 November – 19 December & 6 January – 31 May
  return {
    type: 'high',
    label: 'High Season',
    minNights: 3,
    multiplier: 1.25,
    badgeColor: 'bg-indigo-900/10 text-indigo-900 border-indigo-900/20',
  };
}

export interface StayPricingBreakdown {
  nights: number;
  minNightsRequired: number;
  isValidMinStay: boolean;
  minStayViolationMessage: string | null;
  primarySeason: SeasonInfo;
  nightlyBreakdown: Array<{
    date: Date;
    formattedDate: string;
    season: SeasonInfo;
    basePrice: number;
    nightlyRate: number;
  }>;
  subtotalRoomBeforeDiscount: number;
  ratePlanDiscountPercent: number;
  roomDiscountAmount: number;
  roomTotal: number;
  transferCost: number;
  transferDetails: string;
  extrasBreakdown: Array<{ name: string; cost: number }>;
  extrasTotal: number;
  grandTotal: number;
  depositDueNow: number;
  balanceDueLater: number;
  cancellationDeadline: string;
  cancellationPolicyNote: string;
}

export function calculateStayPricing({
  accommodationId,
  dates,
  guests,
  ratePlan,
  transferOption,
  transferTripType,
  extras,
}: {
  accommodationId: string | null;
  dates: { from: Date | undefined; to: Date | undefined };
  guests: { adults: number; children: number };
  ratePlan: RatePlan;
  transferOption: TransferOption;
  transferTripType: 'roundtrip' | 'oneway';
  extras: {
    airportTransfer: boolean;
    privateDinner: boolean;
    marineExpedition: boolean;
    wellnessPackage: boolean;
  };
}): StayPricingBreakdown {
  const accommodation = accommodations.find((a) => a.id === accommodationId);
  const basePrice = accommodation?.price || 0;

  if (!dates.from || !dates.to) {
    return {
      nights: 0,
      minNightsRequired: 2,
      isValidMinStay: true,
      minStayViolationMessage: null,
      primarySeason: getSeasonForDate(new Date()),
      nightlyBreakdown: [],
      subtotalRoomBeforeDiscount: 0,
      ratePlanDiscountPercent: 0,
      roomDiscountAmount: 0,
      roomTotal: 0,
      transferCost: 0,
      transferDetails: '',
      extrasBreakdown: [],
      extrasTotal: 0,
      grandTotal: 0,
      depositDueNow: 0,
      balanceDueLater: 0,
      cancellationDeadline: '',
      cancellationPolicyNote: '',
    };
  }

  const nights = differenceInDays(dates.to, dates.from);
  const nightlyBreakdown: Array<{
    date: Date;
    formattedDate: string;
    season: SeasonInfo;
    basePrice: number;
    nightlyRate: number;
  }> = [];

  let hasFestiveNight = false;
  let hasHighNight = false;
  let subtotalRoomBeforeDiscount = 0;

  for (let i = 0; i < nights; i++) {
    const nightDate = addDays(dates.from, i);
    const season = getSeasonForDate(nightDate);
    if (season.type === 'festive') hasFestiveNight = true;
    if (season.type === 'high') hasHighNight = true;

    const nightlyRate = Math.round(basePrice * season.multiplier);
    subtotalRoomBeforeDiscount += nightlyRate;

    nightlyBreakdown.push({
      date: nightDate,
      formattedDate: format(nightDate, 'EEE, MMM d'),
      season,
      basePrice,
      nightlyRate,
    });
  }

  // Determine minimum stay rule
  // Festive overlay: if ANY night falls in Festive -> 5-night minimum applies
  let minNightsRequired = 2;
  let primarySeasonType: SeasonType = 'green';

  if (hasFestiveNight) {
    minNightsRequired = 5;
    primarySeasonType = 'festive';
  } else if (hasHighNight) {
    minNightsRequired = 3;
    primarySeasonType = 'high';
  } else {
    minNightsRequired = 2;
    primarySeasonType = 'green';
  }

  const primarySeason = getSeasonForDate(dates.from);
  const isValidMinStay = nights >= minNightsRequired;
  const minStayViolationMessage = !isValidMinStay && nights > 0
    ? `${hasFestiveNight ? 'Festive Season' : hasHighNight ? 'High Season' : 'Green Season'} requires a minimum stay of ${minNightsRequired} nights (${nights} selected).`
    : null;

  // Rate plan discounts
  let ratePlanDiscountPercent = 0;
  if (ratePlan === 'advance') {
    ratePlanDiscountPercent = 15;
  } else if (ratePlan === 'stayLonger' && nights >= 5) {
    ratePlanDiscountPercent = 10;
  }

  const roomDiscountAmount = Math.round(
    (subtotalRoomBeforeDiscount * ratePlanDiscountPercent) / 100
  );
  const roomTotal = subtotalRoomBeforeDiscount - roomDiscountAmount;

  // Transfer pricing
  let transferCost = 0;
  let transferDetails = 'None selected';
  const totalGuests = guests.adults + guests.children;
  const tripMultiplier = transferTripType === 'roundtrip' ? 2 : 1;

  if (transferOption === 'pps_standard') {
    // Up to 4 guests
    const legCost = totalGuests <= 4 ? 9500 : 13500;
    transferCost = legCost * tripMultiplier;
    transferDetails = `Puerto Princesa SUV (${totalGuests <= 4 ? 'Standard' : 'Group Van'}, ${transferTripType})`;
  } else if (transferOption === 'pps_group') {
    transferCost = 13500 * tripMultiplier;
    transferDetails = `Puerto Princesa Group Van (${transferTripType})`;
  } else if (transferOption === 'swl_local') {
    transferCost = 2500 * tripMultiplier;
    transferDetails = `San Vicente Airport Pickup (${transferTripType})`;
  }

  // Extras
  const extrasBreakdown: Array<{ name: string; cost: number }> = [];
  if (transferCost > 0) {
    extrasBreakdown.push({ name: transferDetails, cost: transferCost });
  }
  if (extras.privateDinner) {
    extrasBreakdown.push({ name: 'Garden Table Coastal Dining (5 courses)', cost: 15000 });
  }
  if (extras.marineExpedition) {
    const cost = 7500 * Math.max(1, guests.adults);
    extrasBreakdown.push({ name: `Guided Marine Reef Expedition (${guests.adults} guests)`, cost });
  }
  if (extras.wellnessPackage) {
    const cost = 9500 * Math.max(1, guests.adults);
    extrasBreakdown.push({ name: `Restorative Botanical Wellness Ritual (${guests.adults} guests)`, cost });
  }

  const extrasTotal = extrasBreakdown.reduce((sum, item) => sum + item.cost, 0);
  const grandTotal = roomTotal + extrasTotal;

  // Deposit vs Balance Due
  let depositDueNow = 0;
  let balanceDueLater = 0;
  let cancellationPolicyNote = '';

  if (ratePlan === 'advance') {
    depositDueNow = grandTotal;
    balanceDueLater = 0;
    cancellationPolicyNote = '100% Non-refundable prepayment. Changes and cancellations not permitted.';
  } else {
    // Flexible & Stay Longer: 50% deposit of room + extras, balance at 14-day boundary
    depositDueNow = Math.round(roomTotal * 0.5) + extrasTotal;
    balanceDueLater = grandTotal - depositDueNow;
    cancellationPolicyNote = 'Fully refundable up to 14 days prior to arrival. Remaining balance due at the 14-day boundary.';
  }

  const cancelDate = subDays(dates.from, 14);
  const cancellationDeadline = format(cancelDate, 'MMMM d, yyyy');

  return {
    nights,
    minNightsRequired,
    isValidMinStay,
    minStayViolationMessage,
    primarySeason,
    nightlyBreakdown,
    subtotalRoomBeforeDiscount,
    ratePlanDiscountPercent,
    roomDiscountAmount,
    roomTotal,
    transferCost,
    transferDetails,
    extrasBreakdown,
    extrasTotal,
    grandTotal,
    depositDueNow,
    balanceDueLater,
    cancellationDeadline,
    cancellationPolicyNote,
  };
}
