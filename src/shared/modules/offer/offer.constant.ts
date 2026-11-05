import { Location } from '../../types/index.js';

export const DEFAULT_OFFER_COUNT = 60;
export const DEFAULT_PREMIUM_OFFER_COUNT = 3;

export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export const CITY_LOCATIONS: Record<typeof CITIES[number], Location> = {
  Paris: { latitude: 48.85661, longitude: 2.351499, zoom: 13 },
  Cologne: { latitude: 50.938361, longitude: 6.959974, zoom: 13 },
  Brussels: { latitude: 50.846557, longitude: 4.351697, zoom: 13 },
  Amsterdam: { latitude: 52.370216, longitude: 4.895168, zoom: 13 },
  Hamburg: { latitude: 53.550341, longitude: 10.000654, zoom: 13 },
  Dusseldorf: { latitude: 51.225402, longitude: 6.776314, zoom: 13 },
};

export function getCityByName(name: string) {
  return {
    name,
    location: CITY_LOCATIONS[name as typeof CITIES[number]],
  };
}

export const OFFER_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;

export const GOODS = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
] as const;
