const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");
require('dotenv').config()

const PORT = parseInt(process.env.PORT || '', 10)
const ACCOUNTS_URL = process.env.ACCOUNTS_URL
const INVENTORY_URL = process.env.INVENTORY_URL
const PRODUCTS_URL = process.env.PRODUCTS_URL
const REVIEWS_URL = process.env.REVIEWS_URL

const gateway = new ApolloGateway({
  // This entire `serviceList` is optional when running in managed federation
  // mode, using Apollo Graph Manager as the source of truth.  In production,
  // using a single source of truth to compose a schema is recommended and
  // prevents composition failures at runtime using schema validation using
  // real usage-based metrics.
  serviceList: [
    { name: "accounts", url: ACCOUNTS_URL + "/graphql" },
    { name: "reviews", url: REVIEWS_URL + "/graphql" },
    { name: "products", url: PRODUCTS_URL + "/graphql" },
    { name: "inventory", url: INVENTORY_URL + "/graphql" }
  ],
  debug: true,
  serviceHealthCheck: true,
  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false,
});

(async () => {
  const server = new ApolloServer({
    gateway,
    cors: {
      origin: '*',			// <- allow request from all domains
      credentials: true},	
    onHealthCheck: () => {
      return new Promise((resolve, reject) => {
        // Replace the `true` in this conditional with more specific checks!
        if (true) {
          resolve();
        } else {
          reject();
        }
      });
    },

    // Apollo Graph Manager (previously known as Apollo Engine)
    // When enabled and an `ENGINE_API_KEY` is set in the environment,
    // provides metrics, schema management and trace reporting.
    engine: false,

    // Subscriptions are unsupported but planned for a future Gateway version.
    subscriptions: false,
  });

  server.listen({ port: PORT }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(
      `Try your health check at: ${url}.well-known/apollo/server-health`,
    );
    console.log(`🚀 connected to products api on ${PRODUCTS_URL}`);
    console.log(`🚀 connected to reviews api on ${REVIEWS_URL}`);
    console.log(`🚀 connected to accounts api on ${ACCOUNTS_URL}`);
    console.log(`🚀 connected to inventory api on ${INVENTORY_URL}`);
  });
})();
