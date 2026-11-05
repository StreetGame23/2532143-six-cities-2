import { UserType } from './const';
import type { Comment, NewOffer, Offer, User } from './types/types';

type ApiUser = {
  id?: string;
  email: string;
  name: string;
  avatarUrl: string;
  isPro?: boolean;
};

type ApiCity = {
  name: string;
  location: {
    latitude: number;
    longitude: number;
    zoom?: number;
  };
};

type ApiOffer = {
  id: string;
  title: string;
  description?: string;
  publicationDate?: string;
  city: ApiCity | string;
  previewImage: string;
  images?: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: Offer['type'];
  bedrooms?: number;
  maxAdults?: number;
  price: number;
  goods?: string[];
  host?: ApiUser;
  commentCount?: number;
  location?: {
    latitude: number;
    longitude: number;
    zoom?: number;
  };
};

type ApiComment = {
  id: string;
  text: string;
  rating: number;
  postDate: string;
  user: ApiUser;
};

const defaultUser: User = {
  name: '',
  avatarUrl: '',
  email: '',
  type: UserType.Regular,
};

export const adaptUser = (user?: ApiUser): User => {
  if (!user) {
    return defaultUser;
  }

  return {
    name: user.name,
    avatarUrl: user.avatarUrl,
    email: user.email,
    type: user.isPro ? UserType.Pro : UserType.Regular,
  };
};

const adaptCity = (city: ApiCity | string): Offer['city'] => {
  if (typeof city === 'string') {
    return {
      name: city,
      location: { latitude: 0, longitude: 0 },
    };
  }

  return {
    name: city.name,
    location: {
      latitude: city.location.latitude,
      longitude: city.location.longitude,
    },
  };
};

const hasCoordinates = (location?: ApiOffer['location']): location is NonNullable<ApiOffer['location']> =>
  Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);

export const adaptOffer = (offer: ApiOffer): Offer => {
  const city = adaptCity(offer.city);
  const location = hasCoordinates(offer.location)
    ? { latitude: offer.location.latitude, longitude: offer.location.longitude }
    : city.location;

  return {
    id: offer.id,
    price: offer.price,
    rating: offer.rating,
    title: offer.title,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    city,
    location,
    previewImage: offer.previewImage,
    type: offer.type,
    bedrooms: offer.bedrooms ?? 0,
    description: offer.description ?? '',
    goods: offer.goods ?? [],
    host: adaptUser(offer.host),
    images: offer.images ?? [],
    maxAdults: offer.maxAdults ?? 0,
  };
};

export const adaptOffers = (offers: ApiOffer[]): Offer[] => offers.map(adaptOffer);

export const adaptComment = (comment: ApiComment): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.postDate,
  rating: comment.rating,
  user: adaptUser(comment.user),
});

export const adaptComments = (comments: ApiComment[]): Comment[] => comments.map(adaptComment);

export const toCreateOfferDto = (offer: NewOffer) => ({
  title: offer.title,
  description: offer.description,
  publicationDate: new Date().toISOString(),
  city: offer.city.name,
  previewImage: offer.previewImage,
  images: offer.images,
  isPremium: offer.isPremium,
  type: offer.type,
  bedrooms: offer.bedrooms,
  maxAdults: offer.maxAdults,
  price: offer.price,
  goods: offer.goods,
  location: {
    latitude: offer.location.latitude,
    longitude: offer.location.longitude,
    zoom: 13,
  },
});

export const toUpdateOfferDto = (offer: Offer) => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name,
  previewImage: offer.previewImage,
  images: offer.images,
  isPremium: offer.isPremium,
  type: offer.type,
  bedrooms: offer.bedrooms,
  maxAdults: offer.maxAdults,
  price: offer.price,
  goods: offer.goods,
  location: {
    latitude: offer.location.latitude,
    longitude: offer.location.longitude,
    zoom: 13,
  },
});
