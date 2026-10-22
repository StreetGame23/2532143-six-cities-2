export const CreateUpdateOfferMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  publicationDate: {
    invalidFormat: 'publicationDate must be a valid ISO date',
  },
  city: {
    invalid: 'city must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  previewImage: {
    invalidFormat: 'previewImage must be a string',
  },
  images: {
    invalidFormat: 'images must be an array',
    length: 'images must contain 6 items',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  type: {
    invalidFormat: 'type must be one of: apartment, house, room, hotel',
  },
  bedrooms: {
    invalidFormat: 'bedrooms must be an integer',
    min: 'Minimum bedrooms is 1',
    max: 'Maximum bedrooms is 8',
  },
  maxAdults: {
    invalidFormat: 'maxAdults must be an integer',
    min: 'Minimum maxAdults is 1',
    max: 'Maximum maxAdults is 10',
  },
  price: {
    invalidFormat: 'price must be an integer',
    min: 'Minimum price is 100',
    max: 'Maximum price is 100000',
  },
  goods: {
    invalidFormat: 'goods must be an array of allowed amenities',
  },
} as const;
