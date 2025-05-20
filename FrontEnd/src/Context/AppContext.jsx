import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
 
  const [PageNum, setPageNum] = useState(1);
 
  const [numStu, setNumStu] = useState(20);
  const [numTasks, setNumTasks] = useState(30);
  const [numFinishedProjects, setNumFinishedProjects] = useState(8);
  const [taskId, setTaskId] = useState(5);
  const [newTask, setNewTask] = useState(0);

 
  const [stuIds, setStuIds] = useState(["123", "456", "789"]);
 const [projectsName, setProjectsName] = useState([
    "Website Redesign",
    "Mobile App Development",
    "E-commerce Platform",
  ]);
  const [currStu, setCurrStu] = useState("ahmad2");
  const [users, setUsers] = useState(() => {
  const stored = localStorage.getItem("users");
  return stored ? JSON.parse(stored) : [
    { role: "admin", userName: "ahmad", password: "123" },
    { role: "admin", userName: "sara", password: "sara2023" },
    { role: "student", userName: "ali", password: "123" },
    { role: "student", userName: "ahmad2", password: "123" },
    { role: "student", userName: "sara2", password: "123" },
     { role: "admin", userName: "sana", password: "2007" },
  ];
});

 const [students, setStu] = useState(["ahmad2", "sara2", "ali"]);
const allUserNames = users.map(user => user.userName);
const adminNames = users
  .filter(user => user.role === "admin")
  .map(admin => admin.userName);
  const [tasks, setTasks] = useState([
    { taskId: 1, project: "Website Redesign", taskName: "Design Homepage", description: "Create a responsive design for the homepage.", assignedStudent: "ali", status: "In Progress", dueDate: "4/22/2023" },
    { taskId: 2, project: "Website Redesign", taskName: "Develop API", description: "Set up the backend API for the project.", assignedStudent: "ahmad2", status: "Completed", dueDate: "1/16/2023" },
    { taskId: 3, project: "Mobile App Development", taskName: "Write Documentation", description: "Document the project setup and usage.", assignedStudent: "sara2", status: "Pending", dueDate: "3/15/2023" },
    { taskId: 4, project: "Mobile App Development", taskName: "Testing", description: "Conduct testing for all features.", assignedStudent: "ali", status: "In Progress", dueDate: "11/29/2023" },
    { taskId: 5, project: "E-commerce Platform", taskName: "Deploy Application", description: "Deploy the application to the production server.", assignedStudent: "ahmad2", status: "Pending", dueDate: "3/24/2023" },
  ]);

 
 const [categories, setCategories] = useState([
  "Website Redesign",
  "Mobile App Development",
  "E-commerce Platform"
]);
const [projects, setProjects] = useState([
    {
      title: "Website Redesign",
      description: "Redesign the company website to improve user experience.",
      students: ["ali", "ahmad2"],
      category: "Web Development",
      progress: 100,
      startDate: "2023-01-01",
      endDate: "2023-08-01",
    },
    {
      title: "Mobile App Development",
      description: "Develop a mobile application for our services.",
      students: ["sara2", "ahmad2"],
      category: "Mobile Development",
      progress: 100,
      startDate: "2023-02-15",
      endDate: "2023-08-15",
    },
    {
      title: "Data Analysis Project",
      description: "Analyze data from last quarter to find insights.",
      students: ["ali","sara2"],
      category: "Data Science",
      progress: 100,
      startDate: "2023-03-01",
      endDate: "2023-05-01",
    },
    {
      title: "Machine Learning Model",
      description: "Create a machine learning model for predictions.",
      students: ["ali", "sara2"],
      category: "Machine Learning",
      progress: 100,
      startDate: "2023-04-01",
      endDate: "2023-09-01",
    },
    {
      title: "Machine Learning Model 2",
      description: "Create a second machine learning model for predictions.",
      students: ["ali", "ahmad2"],
      category: "Machine Learning",
      progress: 56,
      startDate: "2023-04-01",
      endDate: "2026-09-01",
    },
  ]);
  // Load initial data from localStorage
  
  // Persist projects to localStorage when they change
  useEffect(() => {
    localStorage.setItem("fullProjs", JSON.stringify(projects));
  }, [projects]);

  // Persist students if you update them elsewhere
  useEffect(() => {
    if (students.length) {
      localStorage.setItem("students", JSON.stringify(students));
    }
  }, [students]);

  

  const [taskUpdated, setTaskUpdated] = useState(false);//new


const [currUser, setCurrUser] = useState({
    stu_id:"",
    name: "",
    password: "",
    role: "",
  });
  
  const [currStuId, setCurrStuId] = useState("");
   const [logHome, setLogHome] = useState(0); //set it log page first
   

  return (
    <AppContext.Provider
      value={{
        PageNum,
        setPageNum,
       
        numStu,
        setNumStu,
        numTasks,
        setNumTasks,
        numFinishedProjects,
        setNumFinishedProjects,
        tasks,
        setTasks,
        taskId,
        setTaskId,
        newTask,
        setNewTask,
        students,
        stuIds,
        setStuIds,
        projectsName,
        setProjectsName,
        currStu,
        setCurrStu,
        users,
        setUsers,
       
        categories,
        allUserNames,
        adminNames,
        currStuId,
        setCurrStuId,
        logHome,
        setLogHome,
        currUser,
        setCurrUser,
        setStu,
         taskUpdated,
        setTaskUpdated       
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
