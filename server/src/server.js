import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server'
import { MONGO_CONNECTION_STRING, PORT } from './config.js'
import { schema } from './schema.js'

;(async function main() {
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB Connected')

    const server = new ApolloServer({ schema })
    const { url } = await server.listen({ port: PORT })
    console.log(`🚀  Server ready at ${url}`)
  } catch (err) {
    console.log(err)
  }
})()
