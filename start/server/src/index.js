const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const store = createStore(); // set up our SQLite database

const server = new ApolloServer({
  context: async ({ req }) => {
    // Here's what our context function does:
    // Obtain the value of the Authorization header(if any) included in the incoming request.
    // Decode the value of the Authorization header.
    // If the decoded value resembles an email address, obtain user details for that email address
    // from the database and return an object that includes those details in the user field.
    const auth = req.headers && req.headers.authorization || ''; // simple auth check on every request
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] || null;
    return { user: { ...user.dataValues } };
  },
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