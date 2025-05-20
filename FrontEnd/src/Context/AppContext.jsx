import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [PageNum, setPageNum] = useState(1);

  const [numStu, setNumStu] = useState(20);
  const [numTasks, setNumTasks] = useState(30);
  const [numFinishedProjects, setNumFinishedProjects] = useState(8);
  const [taskId, setTaskId] = useState(5);
  const [newTask, setNewTask] = useState(0);

  const [categories, setCategories] = useState([
    "Website Redesign",
    "Mobile App Development",
    "E-commerce Platform",
  ]);

  const [taskUpdated, setTaskUpdated] = useState(false); //new

  const [currUser, setCurrUser] = useState({
    stu_id: "",
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
        taskId,
        setTaskId,
        newTask,
        setNewTask,
        categories,
        currUser,
        setCurrUser,
        taskUpdated,
        setTaskUpdated,
        currStuId,
        setCurrStuId,
        logHome,
        setLogHome
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
