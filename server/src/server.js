const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server')

const { MONGO_CONNECTION_STRING } = require('./config')
const { PORT } = require('./config')

const { schema } = require('./schema')
// const app = require('./app')

async function main() {
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true })
    console.log('MongoDB Connected')
  } catch (err) {
    console.log(err)
  }

  const server = new ApolloServer({ schema })
  server.listen({ port: PORT }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

main()
