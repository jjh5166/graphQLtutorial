const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const store = createStore(); // set up our SQLite database

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }) // pass the database to the UserAPI constructor
  })
  // dataSources option is a function that returns an object containing newly instantiated data sources.

  // If you use this.context in a datasource, it's critical to create a new instance in the dataSources function,
  // rather than sharing a single instance. Otherwise, initialize might be called during the execution of
  // asynchronous code for a particular user, replacing this.context with the context of another user.
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});