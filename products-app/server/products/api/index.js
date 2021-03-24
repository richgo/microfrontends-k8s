const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
require('dotenv').config()

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5): [Product],
    getProduct(upc: String!): Product
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    }
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    },
    getProduct(_, args) {
      return products.find(product => product.upc === args.upc);
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
const PORT = parseInt(process.env.PORT || '', 10) || 4003

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(
    `Try your health check at: ${url}.well-known/apollo/server-health`,
  );
});

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50
  }
];
