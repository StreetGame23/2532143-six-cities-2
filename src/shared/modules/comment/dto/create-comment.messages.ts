export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: 'min is 5, max is 1024',
  },
  rating: {
    invalidFormat: 'rating must be an integer from 1 to 5',
  },
  offerId: {
    invalidFormat: 'offerId must be a valid id',
  },
  userId: {
    invalidFormat: 'userId must be a valid id',
  },
} as const;
