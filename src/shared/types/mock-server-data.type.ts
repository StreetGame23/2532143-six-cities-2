export type MockServerData = {
  types: string[];
  titles: string[];
  descriptions: string[];
  isFavorite: boolean[];
  isPremium: boolean[];
  ratings: number[];
  images: string[];
  prices: number[];
  bedrooms: number[];
  goods: string[];
  maxAdults: number[];
};

export type MockServerDataFile = {
  api: MockServerData;
};
