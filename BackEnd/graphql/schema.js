const { gql } = require("apollo-server");
const typeDefs = gql`
  type User {
    stu_id: String
    name: String!
    password: String!
    role: String!
  }
  type Project {
  id: ID!
  title: String!
  description: String
  students: [String]
  category: String
  progress: Int
  startDate: String
  endDate: String
}
  type Task {
    taskId: String!
    taskName: String!
    projectName: String!
    description: String!
    assignedStudent: String!
    status: String!
    dueDate: String!
  }

  type Query {
    user(name: String!, password: String!): User
    allUsers: [User!]
     getProjects: [Project]
     project(title: String!): Project
      students: [User!]!
       getTasks(projectName: String!): [Task]
        allTasks: [Task!]
    allProjects:[Project!]
  }

  type Mutation {
    addUser(stu_id: String, name: String!, password: String!, role: String!): User
    deleteUser(name: String!, password: String!): Boolean
    addProject(
      title: String!
      description: String!
      students: [String!]!
      category: String!
      progress: Int!
      startDate: String!
      endDate: String!
    ): Project

    deleteProject(title: String!): Boolean
    addTask(
      taskId: String!
      taskName: String!
      projectName: String!
      description: String!
      assignedStudent: String!
      status: String!
      dueDate: String!
    ): Task
    updateTask(taskId:String!, status: String!): [Task!] 
  }
   
`;
module.exports = { typeDefs };
