import { neon } from "@neondatabase/serverless";
export function database(){const url=process.env.DATABASE_URL;return url?neon(url):null;}
