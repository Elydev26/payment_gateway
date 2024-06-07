import * as Joi from 'joi';
import { envConfiguration } from '../env/env.config';
// NOTE: THIS ARE STANDARD CONFIGS FOR THE UTILS LIBRARY
export const envValidator = Joi.object().keys({
  [envConfiguration.PORT]: Joi.string().trim().required(),
  [envConfiguration.TOKEN_EXPIRATION_TIME]: Joi.string().trim().required(),
  [envConfiguration.TOKEN_SECRET]: Joi.string().trim().required(),
  [envConfiguration.CONNECTION_STRING]: Joi.string().trim().required(),
  [envConfiguration.REFRESH_TOKEN_EXPIRATION_TIME]: Joi.string()
    .trim()
    .required(),
});
