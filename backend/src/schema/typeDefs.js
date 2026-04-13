const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    designation: String!
    employee_photo: String
    createdAt: String
    updatedAt: String
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    designation: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    salary: Float
    date_of_joining: String
    department: String
    designation: String
    employee_photo: String
  }

  type Query {
    login(username: String!, password: String!): AuthPayload!
    getAllEmployees: [Employee!]!
    searchEmployeeByEid(eid: ID!): Employee
    searchEmployeeByDesignation(designation: String!): [Employee!]!
    searchEmployeeByDepartment(department: String!): [Employee!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User!
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(eid: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(eid: ID!): String!
  }
`;

module.exports = typeDefs;
