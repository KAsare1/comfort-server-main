export const PRICING_CONSTANTS = {
  BASE_PRICE: 25, // GHS
  ROUND_TRIP_MULTIPLIER: 1.8,
  PEAK_HOUR_MULTIPLIER: 1.5,
  DISTANCE_RATE_PER_KM: 2.5, // GHS per km
  TIME_RATE_PER_MINUTE: 0.5, // GHS per minute
  MINIMUM_FARE: 15, // GHS
  MAXIMUM_FARE: 500, // GHS
  CANCELLATION_FEE: 5, // GHS
  PEAK_HOURS: [
    { start: '07:00', end: '09:00' }, // Morning rush
    { start: '17:00', end: '19:00' }, // Evening rush
  ],
  SERVICE_AREAS: [
    'Greater Accra',
    'Tema',
    'Kasoa',
  ],
};
