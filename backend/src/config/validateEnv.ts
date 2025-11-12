import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('*'),
  WS_TICK_MS: Joi.number().default(1000),
  WS_JITTER_MS: Joi.number().default(250),
}).unknown(true);
