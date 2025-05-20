const User = require("../models/User");
const Project = require('../models/Projects');
const Task = require('../models/Task');

const resolvers = {
  Query: {
    allUsers: async () => await User.find(),

    user: async (_, { name, password }) =>
      await User.findOne({ name, password }),

    getProjects: async () => await Project.find(),

    project: async (_, { title }) =>
      await Project.findOne({ title }),
    async allTasks(parent, args){
      return await Task.find();
    },

    async allProjects(parent, args){
      return await Project.find();
    },

    getTasks: async (_, { projectName }) =>
      await Task.find({ projectName }),
      students: async () => await User.find({ role: "student" }),
  },

  Mutation: {
   async addUser(parent, { stu_id, name, password, role  }) {
      const newUserData = {
        stu_id: stu_id,
        name,
        password,
        role,
      };

      const newUser = new User(newUserData);
      const savedUser = await newUser.save();
      console.log(savedUser);
      return newUser;
    },

    async deleteUser(parent, { name, password }) {
      const deletedUser = await User.findOneAndDelete({
        name: name,
        password: password,
      });
        return !!deletedUser;
    },

    addProject: async (_, args) => {
      const newProject = new Project(args);
      await newProject.save();
      return newProject;
    },

    deleteProject: async (_, { title }) => {
      const result = await Project.deleteOne({ title });
      return result.deletedCount > 0;
    },
    async addTask(parent, {taskId, taskName, projectName, description, assignedStudent,status, dueDate}){
      const newTask ={
        taskId : taskId,
         taskName:taskName, 
         projectName:projectName, 
         description:description, 
         assignedStudent:assignedStudent,
         status:status, 
         dueDate:dueDate
      };
      const task= new Task(newTask);
      const savedTask= await task.save();
      return savedTask;

    },


    async updateTask(parent, {taskId, status}){
      const updatedUser = await Task.findOneAndUpdate(
        {taskId: taskId},
        {status: status},
      );
      return await Task.find();
    },

  },
};

module.exports = { resolvers };
