/**
 * Validates required environment variables at startup.
 * Crashes the process immediately with a clear message if anything is missing
 * rather than failing silently later during a request.
 */
const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`\n❌ Missing required environment variables:\n   ${missing.join('\n   ')}`);
    console.error('\n👉 Copy backend/.env.example to backend/.env and fill in the values.\n');
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long for security.');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
};

module.exports = validateEnv;
