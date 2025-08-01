import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_oGfmt3wa4QHx@ep-orange-lab-ad5iiitd-pooler.c-2.us-east-1.aws.neon.tech/ai-interview-mocker?sslmode=require&channel_binding=require',
  },
});