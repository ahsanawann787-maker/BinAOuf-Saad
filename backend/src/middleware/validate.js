import { ApiError } from '../utils/ApiError.js';

// Validate req[part] against a zod schema; replaces it with the parsed result.
export const validate = (schema, part = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[part]);
  if (!result.success) {
    const details = result.error.issues.map((i) => `${i.path.join('.') || part}: ${i.message}`);
    return next(ApiError.badRequest('Validation failed', details));
  }
  req[part] = result.data;
  next();
};
