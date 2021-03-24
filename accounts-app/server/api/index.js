const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
require('dotenv').config()

const typeDefs = gql`
  extend type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
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

const PORT = parseInt(process.env.PORT || '', 10) || 4001

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(
    `Try your health check at: ${url}.well-known/apollo/server-health`,
  );
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
