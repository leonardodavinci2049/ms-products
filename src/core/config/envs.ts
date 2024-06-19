import 'dotenv/config';

import * as joi from 'joi';
// zod
// env_-schema não usar por enquanto altera o tsconfig
interface EnvVars {
  APP_PORT: number;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object({
    APP_PORT: joi.number().positive().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`❌ Invalid environment variables:  ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  APP_PORT: envVars.APP_PORT,
  DATABASE_URL: envVars.DATABASE_URL,
};
