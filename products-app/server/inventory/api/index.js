const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
require('dotenv').config()

const typeDefs = gql`
  extend type Product @key(fields: "upc") {
    upc: String! @external
    weight: Int @external
    price: Int @external
    inStock: Boolean
    shippingEstimate: Int @requires(fields: "price weight")
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return {
        ...object,
        ...inventory.find(product => product.upc === object.upc)
      };
    },
    shippingEstimate(object) {
      // free for expensive items
      if (object.price > 1000) return 0;
      // estimate is based on weight
      return object.weight * 0.5;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
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
    }
  ])
});
const PORT = parseInt(process.env.PORT || '', 10) || 4004

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(
    `Try your health check at: ${url}.well-known/apollo/server-health`,
  );
});

const inventory = [
  { upc: "1", inStock: true },
  { upc: "2", inStock: false },
  { upc: "3", inStock: true }
];
