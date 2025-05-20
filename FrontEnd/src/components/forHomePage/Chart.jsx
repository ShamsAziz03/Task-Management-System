import React, { useEffect, useRef, useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { gql, useQuery } from "@apollo/client";

const Chart = () => {
  const { numFinishedProjects } = useContext(AppContext);
  const { currUser } = useContext(AppContext);

  const [studentsNum, setStudentsNum] = useState(0);
  const [numProject, setNumProject] = useState(0);
  const [numTasks, setNumTasks] = useState(0);

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
      } else {
        projs = getProjsNumData.allProjects;
      }
      setNumProject(projs.length);
    }
  }, [getProjsNumData]);

  let tasks;
  useEffect(() => {
    if (getTasksNumData && getTasksNumData.allTasks) {
      if (currUser.role === "student") {
        tasks = getTasksNumData.allTasks.filter(
          (task) => task.assignedStudent === currUser.name
        );
      } else {
        tasks = getTasksNumData.allTasks;
      }
      setNumTasks(tasks.length);
    }
  }, [getTasksNumData]);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!window.Chart || !canvasRef.current) return;

    const xValues = ["Projects", "Students", "Tasks", "Finished Projects"];
    const yValues = [numProject, studentsNum, numTasks, numFinishedProjects];
    const barColors = ["#ff6384", "#36a2eb", "#ffce56", "#4caf50"];

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [
          {
            label: "Count",
            backgroundColor: barColors,
            borderColor: ["#64b5f6", "#66bb6a", "#ffca28", "#ba68c8"],
            borderWidth: 2,
            data: yValues,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "white" } },
          title: {
            display: true,
            text: "Admin Dashboard Overview",
            color: "white",
          },
        },
        scales: {
          x: {
            ticks: { color: "white" },
            grid: { color: "rgba(255,255,255,0.2)" },
          },
          y: {
            ticks: { color: "white" },
            grid: { color: "rgba(255,255,255,0.2)" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [numProject, studentsNum, numTasks, numFinishedProjects]);

  return (
    <>
      <canvas ref={canvasRef} id="myChart" />
    </>
  );
};

export default Chart;
