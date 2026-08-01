import { randomUUID } from 'node:crypto';
import { Offer, OfferType } from '../types/offer.type.js';
import { OFFER_TSV_COLUMN_COUNT, OfferTSVRawFields } from '../types/tsv-file-reader.js';

export function createOffer(offerData: string): Offer {
  const fields = offerData.split('\t') as OfferTSVRawFields;

  if (fields.length !== OFFER_TSV_COLUMN_COUNT) {
    throw new Error(`Invalid TSV row: expected ${OFFER_TSV_COLUMN_COUNT} columns, got ${fields.length}`);
  }

  const [
    title,
    description,
    publicationDate,
    cityName,
    previewImage,
    imagesRaw,
    isPremiumRaw,
    isFavoriteRaw,
    ratingRaw,
    typeRaw,
    bedroomsRaw,
    maxAdultsRaw,
    priceRaw,
    goodsRaw,
    hostRaw,
    locationRaw,
  ] = fields;

  const location = JSON.parse(locationRaw);

  return {
    id: randomUUID(),
    title,
    description,
    publicationDate,
    city: {
      name: cityName,
      location,
    },
    previewImage,
    images: imagesRaw.split(','),
    isPremium: isPremiumRaw === 'true',
    isFavorite: isFavoriteRaw === 'true',
    rating: Number.parseInt(ratingRaw, 10),
    type: typeRaw as OfferType,
    bedrooms: Number.parseInt(bedroomsRaw, 10),
    maxAdults: Number.parseInt(maxAdultsRaw, 10),
    price: Number.parseInt(priceRaw, 10),
    goods: goodsRaw.split(','),
    host: JSON.parse(hostRaw),
    location,
  };
}
