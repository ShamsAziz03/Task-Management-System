import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const { setNewTask } = useContext(AppContext);
  const { currUser } = useContext(AppContext);

  const { taskUpdated, setTaskUpdated } = useContext(AppContext); //new

  //get data from DB
  const GET_TASKS = gql`
    query {
      allTasks {
        taskId
        taskName
        projectName
        description
        assignedStudent
        status
        dueDate
      }
    }
  `;

  const UPDATE_TASK = gql`
    mutation ($taskId: String!, $status: String!) {
      updateTask(taskId: $taskId, status: $status) {
        assignedStudent
        description
        status
        taskId
        projectName
        taskName
        dueDate
      }
    }
  `;

  //to get tasks from DB
  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    fetchPolicy: "network-only", // always go to server
  });
  useEffect(() => {
  if (taskUpdated) {
    refetch();
    setTaskUpdated(false);
  }
}, [taskUpdated]);
  useEffect(() => {
    if (data && data.allTasks) {
      setTasks(data.allTasks);
    }
    if (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [data]);

  //to update task status
  const [updateTask, { updateTaskData, updateTaskLoading, updateTaskError }] =
    useMutation(UPDATE_TASK, {
      onCompleted: (updateTaskData) => {
        if (updateTaskData && updateTaskData.updateTask) {
          const newTasks = updateTaskData.updateTask;
          setTasks(newTasks);
        } else {
          alert("Error updating task status");
        }
      },
      onError: (updateTaskError) => {
        alert("Query error: " + updateTaskError.message);
      },
    });

  const visibleTasks =
    currUser.role === "admin"
      ? tasks
      : tasks.filter((task) => task.assignedStudent === currUser.name);

  const sortTasks = (value) => {
    const sorted = [...tasks];
    if (value === "Task Status") {
      sorted.sort((a, b) => a.status.localeCompare(b.status));
    } else if (value === "Project") {
      sorted.sort((a, b) => a.projectName.localeCompare(b.projectName));
    } else if (value === "Due Date") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (value === "Assigned Student") {
      sorted.sort((a, b) => a.assignedStudent.localeCompare(b.assignedStudent));
    }
    setTasks(sorted);
  };

  const changeStatus = (taskId) => {
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task) return;

    const current = task.status;
    const newStatus =
      current === "Pending"
        ? "In Progress"
        : current === "In Progress"
        ? "Completed"
        : "Pending";

    updateTask({
      variables: {
        taskId: task.taskId,
        status: newStatus,
      },
    });
  };

  return (
    <div className="text-white font-sans p-4">
      <section>
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="font-bold text-white">
              Sort By:
            </label>
            <select
              id="sortBy"
              onChange={(e) => sortTasks(e.target.value)}
              className="px-3 py-1 rounded border border-white bg-white text-black text-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300"
            >
              <option value="Task Status">Task Status</option>
              <option value="Project">Project</option>
              <option value="Due Date">Due Date</option>
              <option value="Assigned Student">Assigned Student</option>
            </select>
          </div>
          <div>
            <a
              href="#"
              onClick={() => setNewTask(1)}
              className="no-underline px-4 py-2 bg-blue-600 text-white rounded text-base hover:bg-blue-700 active:bg-blue-800"
            >
              Create a New Task
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 border border-gray-700 shadow-md">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-left px-4 py-2 border-b border-gray-600 text-sm">
                  Task ID
                </th>
                <th className="text-left px-4 py-2 border-b border-gray-600 text-sm">
                  Project
                </th>
                <th className="text-left px-4 py-2 border-b border-gray-600 text-sm">
                  Task Name
                </th>
                <th className="text-left px-4 py-2 border-b border-gray-600 text-sm">
                  Description
                </th>
                <th className="text-left px-4 py-2 border-b border-gray-600 text-sm">
                  Assigned Student
                </th>
                <th className="text-left px-4 py-2 border-b border-gray-600 text-sm">
                  Status
                </th>
                <th className="text-left px-4 py-2 border-b border-gray-600 text-sm">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleTasks.map((t) => (
                <tr key={t.taskId} className="hover:bg-gray-700">
                  <td className="px-4 py-2 border-b border-gray-700 text-sm">
                    {t.taskId}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-sm">
                    {t.projectName}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-sm">
                    {t.taskName}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-sm">
                    {t.description}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-sm">
                    {t.assignedStudent}
                  </td>
                  <td
                    onClick={() => changeStatus(t.taskId)}
                    className="px-4 py-2 border-b border-gray-700 text-sm cursor-pointer text-blue-400 hover:underline"
                  >
                    {t.status}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-sm">
                    {t.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Tasks;
