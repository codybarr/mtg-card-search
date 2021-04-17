export const PORT = process.env.PORT || 4000
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const MONGO_CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || 'mongodb://mtg@localhost/mtgsearch'
export const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'
