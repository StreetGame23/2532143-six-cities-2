export const CreateUserMessages = {
  email: {
    invalidFormat: 'email must be a valid address',
  },
  avatarUrl: {
    invalidFormat: 'avatarUrl must be a string',
  },
  name: {
    invalidFormat: 'name must be a string',
    lengthField: 'min length is 1, max is 15',
  },
  isPro: {
    invalidFormat: 'isPro must be a boolean',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: 'min length is 6, max is 12',
  },
} as const;
