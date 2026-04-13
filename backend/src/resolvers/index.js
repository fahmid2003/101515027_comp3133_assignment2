const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET || 'comp3133_secret_key';

const resolvers = {
  Query: {
    // Login - returns JWT token and user
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Invalid username or password');
      }
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new Error('Invalid username or password');
      }
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return { token, user };
    },

    // Get all employees
    getAllEmployees: async (_, __, context) => {
      if (!context.userId) throw new Error('Authentication required');
      return await Employee.find().sort({ createdAt: -1 });
    },

    // Search by employee ID
    searchEmployeeByEid: async (_, { eid }, context) => {
      if (!context.userId) throw new Error('Authentication required');
      const employee = await Employee.findById(eid);
      if (!employee) throw new Error('Employee not found');
      return employee;
    },

    // Search by designation (position)
    searchEmployeeByDesignation: async (_, { designation }, context) => {
      if (!context.userId) throw new Error('Authentication required');
      return await Employee.find({
        designation: { $regex: designation, $options: 'i' }
      });
    },

    // Search by department
    searchEmployeeByDepartment: async (_, { department }, context) => {
      if (!context.userId) throw new Error('Authentication required');
      return await Employee.find({
        department: { $regex: department, $options: 'i' }
      });
    }
  },

  Mutation: {
    // Signup
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        if (existingUser.username === username) {
          throw new Error('Username already taken');
        }
        throw new Error('Email already registered');
      }
      const user = new User({ username, email, password });
      await user.save();
      return user;
    },

    // Add employee
    addEmployee: async (_, { input }, context) => {
      if (!context.userId) throw new Error('Authentication required');
      const existing = await Employee.findOne({ email: input.email });
      if (existing) throw new Error('Employee with this email already exists');
      const employee = new Employee(input);
      await employee.save();
      return employee;
    },

    // Update employee
    updateEmployee: async (_, { eid, input }, context) => {
      if (!context.userId) throw new Error('Authentication required');
      const employee = await Employee.findByIdAndUpdate(
        eid,
        { $set: input },
        { new: true, runValidators: true }
      );
      if (!employee) throw new Error('Employee not found');
      return employee;
    },

    // Delete employee
    deleteEmployee: async (_, { eid }, context) => {
      if (!context.userId) throw new Error('Authentication required');
      const employee = await Employee.findByIdAndDelete(eid);
      if (!employee) throw new Error('Employee not found');
      return `Employee ${employee.first_name} ${employee.last_name} deleted successfully`;
    }
  }
};

module.exports = resolvers;
