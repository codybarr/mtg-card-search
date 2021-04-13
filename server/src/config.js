module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_CONNECTION_STRING:
    process.env.MONGO_CONNECTION_STRING || 'mongodb://mtg@localhost/mtgsearch',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}
