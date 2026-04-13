import { gql } from 'apollo-angular';

// ─── Auth Queries ──────────────────────────────────────────────────────────────

export const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      _id
      username
      email
    }
  }
`;

// ─── Employee Queries ──────────────────────────────────────────────────────────

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      gender
      salary
      date_of_joining
      department
      designation
      employee_photo
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query SearchEmployeeByEid($eid: ID!) {
    searchEmployeeByEid(eid: $eid) {
      _id
      first_name
      last_name
      email
      gender
      salary
      date_of_joining
      department
      designation
      employee_photo
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_BY_DEPARTMENT = gql`
  query SearchEmployeeByDepartment($department: String!) {
    searchEmployeeByDepartment(department: $department) {
      _id
      first_name
      last_name
      email
      gender
      salary
      date_of_joining
      department
      designation
      employee_photo
    }
  }
`;

export const SEARCH_BY_DESIGNATION = gql`
  query SearchEmployeeByDesignation($designation: String!) {
    searchEmployeeByDesignation(designation: $designation) {
      _id
      first_name
      last_name
      email
      gender
      salary
      date_of_joining
      department
      designation
      employee_photo
    }
  }
`;

// ─── Employee Mutations ────────────────────────────────────────────────────────

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      _id
      first_name
      last_name
      email
      department
      designation
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($eid: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(eid: $eid, input: $input) {
      _id
      first_name
      last_name
      email
      gender
      salary
      date_of_joining
      department
      designation
      employee_photo
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployee(eid: $eid)
  }
`;
