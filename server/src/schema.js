const { composeMongoose } = require('graphql-compose-mongoose')
const { schemaComposer } = require('graphql-compose')

const Card = require('./models/Card')

const CardTC = composeMongoose(Card, {})

schemaComposer.Query.addFields({
  cardById: CardTC.mongooseResolvers.findById(),
  cardByIds: CardTC.mongooseResolvers.findByIds(),
  cardOne: CardTC.mongooseResolvers.findOne(),
  cardMany: CardTC.mongooseResolvers.findMany(),
  cardDataLoader: CardTC.mongooseResolvers.dataLoader(),
  cardDataLoaderMany: CardTC.mongooseResolvers.dataLoaderMany(),
  // cardByIdLean: CardTC.mongooseResolvers.findByIdLean(),
  // cardByIdsLean: CardTC.mongooseResolvers.findByIdsLean(),
  // cardOneLean: CardTC.mongooseResolvers.findOneLean(),
  // cardManyLean: CardTC.mongooseResolvers.findManyLean(),
  // cardDataLoaderLean: CardTC.mongooseResolvers.dataLoaderLean(),
  // cardDataLoaderManyLean: CardTC.mongooseResolvers.dataLoaderManyLean(),
  cardCount: CardTC.mongooseResolvers.count(),
  cardConnection: CardTC.mongooseResolvers.connection(),
  cardPagination: CardTC.mongooseResolvers.pagination(),
})

// schemaComposer.Mutation.addFields({
//   userCreateOne: UserTC.mongooseResolvers.createOne(),
//   userCreateMany: UserTC.mongooseResolvers.createMany(),
//   userUpdateById: UserTC.mongooseResolvers.updateById(),
//   userUpdateOne: UserTC.mongooseResolvers.updateOne(),
//   userUpdateMany: UserTC.mongooseResolvers.updateMany(),
//   userRemoveById: UserTC.mongooseResolvers.removeById(),
//   userRemoveOne: UserTC.mongooseResolvers.removeOne(),
//   userRemoveMany: UserTC.mongooseResolvers.removeMany(),
// });

const schema = schemaComposer.buildSchema()

module.exports = { schema }
