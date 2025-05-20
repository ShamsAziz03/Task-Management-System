import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import "../../styles/NewTask.css";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";

const NewTask = () => {
  const { setNewTask } = useContext(AppContext);
  const { setPageNum } = useContext(AppContext);
  const { taskUpdated, setTaskUpdated } = useContext(AppContext); //new
  const { currUser } = useContext(AppContext);

  const [project, setProject] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedStudent, setAssignedStudent] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [students, setStudents] = useState([]);
  const [projectsName, setProjects] = useState([]);
  const [tasksNum, setTasksNum] = useState(0);

  const GET_STU_NAMES = gql`
    query {
      allUsers {
        name
        role
      }
    }
  `;

  const GET_PROJ_NAMES = gql`
    query {
      allProjects {
        title
        students
      }
    }
  `;

  const { data, loading, err } = useQuery(GET_STU_NAMES);
  const {
    data: projectData,
    loading: loadingProjects,
    error: projectError,
  } = useQuery(GET_PROJ_NAMES);

  //to get project's and user's names
  useEffect(() => {
    let studs;
    if (data && data.allUsers) {
      studs = data.allUsers.filter((user) => {
        return user.role === "student";
      });
      let result = studs.map((a) => a.name);
      setStudents(result);
      if (currUser.role === "student") {
        const studs = [currUser.name];
        setStudents(studs);
      }
    } else {
      alert("error on fetching users!");
    }

    if (projectData && projectData.allProjects) {
      const projNames = projectData.allProjects;
      if (currUser.role === "student") {
        const projs = projNames.filter((proj) =>
          proj.students.includes(currUser.name)
        );
        setProjects(projs);
        if (projs.length === 1) {
          setProjects(projs);
          setProject(projs[0].title);
        }
      } else {
        setProjects(projNames);
      }
    }
    if (projectError) {
      alert("Query error");
    }
  }, [data, projectData, projectError]);

  //to add new task
  const ADD_NEW_TASK = gql`
    mutation Mutation(
      $taskId: String!
      $taskName: String!
      $projectName: String!
      $description: String!
      $assignedStudent: String!
      $status: String!
      $dueDate: String!
    ) {
      addTask(
        taskId: $taskId
        taskName: $taskName
        projectName: $projectName
        description: $description
        assignedStudent: $assignedStudent
        status: $status
        dueDate: $dueDate
      ) {
        assignedStudent
        description
        dueDate
        projectName
        status
        taskId
        taskName
      }
    }
  `;

  const GET_TASKS = gql`
    query {
      allTasks {
        taskId
        taskName
      }
    }
  `;

  const [
    addTask,
    { data: addTaskData, loading: addTaskLoading, error: addTaskError },
  ] = useMutation(ADD_NEW_TASK, {
    onCompleted: (addTaskData) => {
      if (addTaskData && addTaskData.addTask) {
        console.log(JSON.stringify(addTaskData.addTask));
        setTaskUpdated(true);
      } else {
        alert("error on adding task");
      }
    },
    onError: (addTaskError) => {
      alert("Query error: " + addTaskError.message);
    },
  });

  const [
    getTasks,
    { data: getTasksData, loading: getTasksLoading, error: getTasksError },
  ] = useLazyQuery(GET_TASKS, {
    onCompleted: (getTasksData) => {
      if (getTasksData && getTasksData.allTasks) {
        setTasksNum(getTasksData.allTasks.length);
      } else {
        alert("error on loading tasks");
      }
    },
    onError: (err) => {
      alert("Query error: " + err.message);
    },
  });

  const handleSumbit = async (e) => {
    e.preventDefault(); // Important: prevent default form submit behavior
    const { data: tasksData } = await getTasks(); 

    const existingTasks = tasksData?.allTasks || [];
    const newTaskId = String(existingTasks.length + 1);

    try {
      await addTask({
        variables: {
          taskId: newTaskId,
          taskName,
          projectName: project,
          description,
          assignedStudent,
          status,
          dueDate,
        },
      });

      // Reset inputs only after successful submission
      setProject("");
      setTaskName("");
      setDescription("");
      setAssignedStudent("");
      setStatus("");
      setDueDate("");

      setPageNum(2);
      setNewTask(0);
    } catch (err) {
      console.error("Error adding task:", err.message);
      alert("Failed to add task: " + err.message);
    }
  };

  useEffect(() => {
    if (currUser && !assignedStudent) {
      setAssignedStudent(currUser.name);
    }
  }, [currUser]);

  return (
    <div id="newTask">
      <section id="topSection">
        <section className="header">
          <h1>Create New Task</h1>
          <a href="#" onClick={() => setNewTask(0)}>
            Back
          </a>
        </section>

        <form id="taskForm" onSubmit={handleSumbit}>
          <section>
            <label htmlFor="pTitle">Project Title</label>
            <select
              id="pTitle"
              name="pTitle"
              value={project}
              onChange={(e) => {
                setProject(e.target.value);
                getTasks();
              }}
            >
              {projectsName.map((project, index) => (
                <option value={project.title} key={index}>
                  {project.title}
                </option>
              ))}
            </select>
          </section>

          <section>
            <label htmlFor="tName">Task Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="Your name.."
              id="tName"
              onChange={(e) => setTaskName(e.target.value)}
            />
          </section>

          <section>
            <label htmlFor="desc">Decription</label>
            <textarea
              name="subject"
              placeholder="Write something.."
              style={{ height: "200px" }}
              id="desc"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </section>

          <section>
            <label htmlFor="aStu">Assigned Student</label>
            <select
              id="aStu"
              name="chooseStu"
              value={assignedStudent}
              onChange={(e) => {
                setAssignedStudent(e.target.value);
              }}
            >
              {students.map((student, index) => (
                <option value={student} key={index}>
                  {student}
                </option>
              ))}
            </select>
          </section>

          <section>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="InPro">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </section>

          <section>
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              placeholder="choose date.."
              onChange={(e) => setDueDate(e.target.value)}
            />
          </section>

          <section>
            <input type="submit" value="Submit" id="submit" />
          </section>
        </form>
      </section>
    </div>
  );
};
export default NewTask;
