import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds : process.env.bcrypt_salt_rounds,
  default_user_pass : process.env.DEFAULT_PASSWORD,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRE_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRE_IN,
  },
};