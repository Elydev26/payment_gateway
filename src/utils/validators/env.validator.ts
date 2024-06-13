import * as Joi from 'joi';
import { EnvConfigEnum } from '../enums/envConfig.enum';


export const envConfigValidator = Joi.object().keys({
  [EnvConfigEnum.PORT]: Joi.number().required(),
  [EnvConfigEnum.APP_AWS_ACCESS_KEY_ID]: Joi.string().trim().required(),
  [EnvConfigEnum.APP_AWS_REGION]: Joi.string().trim().required(),
  [EnvConfigEnum.APP_AWS_SECRET_ACCESS_KEY]: Joi.string().trim().required(),
  [EnvConfigEnum.TOKEN_EXPIRATION_TIME]: Joi.string().trim().required(),
  [EnvConfigEnum.REFRESH_TOKEN_EXPIRATION_TIME]: Joi.string().trim().required(),
  [EnvConfigEnum.TOKEN_SECRET]: Joi.string().trim().required(),
  [EnvConfigEnum.REFRESH_TOKEN_SECRET]: Joi.string().trim().required(),
  [EnvConfigEnum.CONNECTION_STRING]: Joi.string().trim().required(),
  [EnvConfigEnum.GOOGLE_CLIENT_ID]: Joi.string().trim().required(),
  [EnvConfigEnum.GOOGLE_CLIENT_SECRET]: Joi.string().trim().required(),
  [EnvConfigEnum.GOOGLE_REDIRECT_URL]: Joi.string().trim().required(),
  [EnvConfigEnum.FACEBOOK_CLIENT_ID]: Joi.string().trim().required(),
  [EnvConfigEnum.FACEBOOK_CLIENT_SECRET]: Joi.string().trim().required(),
  [EnvConfigEnum.FACEBOOK_REDIRECT_URI]: Joi.string().trim().required(),
  [EnvConfigEnum.FACEBOOK_REDIRECT_URL]: Joi.string().trim().required(),
  [EnvConfigEnum.REMITA_BASE_URL]: Joi.string().trim().required(),
  [EnvConfigEnum.REMITA_API_KEY]: Joi.string().trim().required(),
  [EnvConfigEnum.REMITA_SECRET_KEY]: Joi.string().trim().required(),
  [EnvConfigEnum.GOOGLE_API_KEY]: Joi.string().trim().required(),
});