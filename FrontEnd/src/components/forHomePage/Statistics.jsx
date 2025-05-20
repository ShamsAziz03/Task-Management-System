import React, { useEffect, useRef, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";

const Statistics = () => {
  
  const { numFinishedProjects, setNumFinishedProjects } =
    useContext(AppContext);
  const { currUser } = useContext(AppContext);

  const [studentsNum, setStudentsNum] = useState(0);
  const [numProject, setNumProject] = useState(0);
  const [ numTasks ,setNumTasks] = useState(0);

  const GET_NUM_STUDs = gql`
    query Query {
      allUsers {
        name
        role
      }
    }
  `;

  const GET_PROJS_NUM = gql`
    query Query {
      allProjects {
        title
        students
      }
    }
  `;
  const GET_TASKS_NUM = gql`
    query Query {
      allTasks {
        assignedStudent
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_NUM_STUDs);
  const {
    data: getProjsNumData,
    loading: getProjsNumLoading,
    error: getProjsNumError,
  } = useQuery(GET_PROJS_NUM);

  const {
    data: getTasksNumData,
    loading: getTasksNumLoading,
    error: getTasksNumError,
  } = useQuery(GET_TASKS_NUM);


  useEffect(() => {
    if (data && data.allUsers) {
      const students = data.allUsers.filter((user) => user.role === "student");
      setStudentsNum(students.length);
    }
  }, [data]);

  let projs;
  useEffect(() => {
    if (getProjsNumData && getProjsNumData.allProjects) {
      if (currUser.role === "student") {
        projs = getProjsNumData.allProjects.filter((proj) =>
         proj.students.includes(currUser.name)
        );
        setNumFinishedProjects(3);
      } else {
        projs = getProjsNumData.allProjects;
        setNumFinishedProjects(8);
      }
      setNumProject(projs.length);
    }
  }, [getProjsNumData]);

    let tasks;
  useEffect(() => {
    if (getTasksNumData && getTasksNumData.allTasks) {
      if (currUser.role === "student") {
        tasks = getTasksNumData.allTasks.filter((task) =>
         task.assignedStudent===currUser.name
        );
      } else {
        tasks = getTasksNumData.allTasks;
      }
      setNumTasks(tasks.length);
    }
  }, [getTasksNumData]);

  return (
    <div>
      <div>
        <h4>Number of Projects {numProject}</h4>
      </div>
      <div>
        <h4>Number of Students {studentsNum}</h4>
      </div>
      <div>
        <h4>Number of Tasks {numTasks}</h4>
      </div>
      <div>
        <h4>Number of Finished Projects {numFinishedProjects}</h4>
      </div>
    </div>
  );
};
export default Statistics;
