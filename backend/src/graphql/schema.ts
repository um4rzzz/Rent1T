import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    user_name: String!
    email: String
    role: String
    created_at: String
    updated_at: String
  }
  type Query {
    users: [User!]!
    user(id: ID!): User
  }
  type Mutation {
    register(user_name: String!, email: String, password: String!): String
    login(user_name: String!, password: String!): String
  }
`;

export default typeDefs;
