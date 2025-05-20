import React, { useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_STUDENTS = gql`
  query {
    students {
      name
      stu_id
      role
    }
  }
`;

const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      id
      title
      description
      students
      category
      progress
      startDate
      endDate
    }
  }
`;

const GET_TASKS = gql`
  query GetTasks($projectName: String!) {
    getTasks(projectName: $projectName) {
      taskId
      taskName
      description
      assignedStudent
      status
      dueDate
    }
  }
`;

const ADD_PROJECT = gql`
  mutation AddProject(
    $title: String!
    $description: String!
    $students: [String!]!
    $category: String!
    $progress: Int!
    $startDate: String!
    $endDate: String!
  ) {
    addProject(
      title: $title
      description: $description
      students: $students
      category: $category
      progress: $progress
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      title
      description
      students
      category
      progress
      startDate
      endDate
    }
  }
`;

const Projects = () => {
  const { categories, currUser } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    students: [],
    category: "",
    progress: 0,
    startDate: "",
    endDate: "",
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedProject, setSearchedProject] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);


  const { loading: projectsLoading, error: projectsError, data: projectsData } = useQuery(GET_PROJECTS);
  const { loading: studentsLoading, error: studentsError, data: studentsData } = useQuery(GET_STUDENTS);
  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
  } = useQuery(GET_TASKS, {
    variables: { projectName: selectedProject },
    skip: !selectedProject,
  });

  const [addProjectMutation, { loading: adding }] = useMutation(ADD_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  if (projectsLoading || studentsLoading)
    return <p className="text-white font-serif p-6">Loading...</p>;

  if (projectsError)
    return <p className="text-red-500 font-serif p-6">Error loading projects.</p>;

  if (studentsError)
    return <p className="text-red-500 font-serif p-6">Error loading students.</p>;

  const projects = projectsData?.getProjects || [];

  const visibleProjects =
    currUser.role === "admin"
      ? projects
      : projects.filter((proj) =>
        proj.students.includes(currUser.name)
      );

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "students") {
      const selected = Array.from(selectedOptions, (opt) => opt.value);
      setNewProject((prev) => ({ ...prev, students: selected }));
    } else if (name === "progress") {
      setNewProject((prev) => ({ ...prev, progress: Number(value) }));
    } else {
      setNewProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProject = async () => {
    try {
      await addProjectMutation({ variables: { ...newProject } });
      setShowModal(false);
      setNewProject({
        title: "",
        description: "",
        students: [],
        category: "",
        progress: 0,
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error("Failed to add project:", err);
      alert("Error adding project. Please try again.");
    }
  };

  return (
    <div className="p-6 text-white font-serif">
      <h2 className="text-3xl font-bold mb-6 text-[#027BFF]">Projects Overview</h2>

      <div className="flex flex-wrap gap-3 items-center mb-6">
        {currUser?.role === "admin" && (
          <button
            className="bg-[#027BFF] hover:bg-[#005fbb] text-white font-bold py-2 px-4 rounded-[12px] shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-1"
            onClick={() => setShowModal(true)}
          >
            Add New Project
          </button>
        )}

        <input
          type="text"
          placeholder="Search projects..."
          className="flex-1 min-w-[200px] px-4 py-2 rounded-[12px] bg-[#3E3D3D] border border-white focus:outline-none focus:border-[#00bfff] transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => {
            const match = visibleProjects.find(
              (proj) =>
                proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proj.description.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (match) {
              setSearchedProject(match);
              setIsSearchModalOpen(true);
            } else {
              setIsSearchModalOpen(false);
            }
          }}
          className="px-4 py-2 text-sm bg-[#027BFF] text-white rounded-[12px] hover:bg-[#009acc] transition"
        >
          Search
        </button>

        <select
          className="min-w-[180px] px-4 py-2 rounded-[12px] bg-[#3E3D3D] border border-white text-white focus:outline-none focus:border-[#00bfff] transition-colors"
          defaultValue=""
        >
          <option value="">All Statuses</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="on-hold">On Hold</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>


      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.length === 0 ? (
          <p>No projects available. Please add a new project.</p>
        ) : (
          visibleProjects.map((proj) => (
            <div
              key={proj.id || proj.title}
              onClick={() => setSelectedProject(proj.title)}
              className={`p-5 rounded-[15px] bg-[#3E3D3D] border-2 cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg text-white font-serif ${selectedProject === proj.title ? "border-[#00bfff]" : "border-transparent"
                }`}
            >
              <h3 className="text-2xl font-semibold mb-3 text-[#027BFF]">{proj.title}</h3>
              <p className="mb-2">{proj.description}</p>
              <p className="mb-1">
                <strong>Students:</strong>{" "}
                {proj.students.length > 0
                  ? proj.students
                    .map(
                      (stuId) =>
                        studentsData.students.find((s) => s.stu_id === stuId)?.name || stuId
                    )
                    .join(", ")
                  : "None"}
              </p>
              <p className="mb-1">
                <strong>Category:</strong> {proj.category}
              </p>

              <div className="relative w-full h-6 rounded overflow-hidden bg-[#555] mt-3">
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 text-black font-bold z-10 select-none"
                >
                  {proj.progress}%
                </div>
                <div
                  className="h-full bg-[#027BFF] transition-all duration-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              <div className="mt-3 text-sm text-gray-300 flex justify-between">
                <p><strong>Start:</strong> {proj.startDate || "N/A"}</p>
                <p><strong>End:</strong> {proj.endDate || "N/A"}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedProject && (
        <div
          className="fixed top-0 left-0 h-full bg-[#3E3D3D] border-r-4 border-[#027BFF] shadow-lg z-50 p-4 font-serif text-white box-border flex flex-col"
          style={{ width: "300px", minWidth: "300px" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#027BFF] max-w-full pr-4">
              {selectedProject} Tasks
            </h3>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-white hover:text-[#027BFF] font-bold text-2xl leading-none"
              aria-label="Close tasks sidebar"
            >
              &times;
            </button>
          </div>

          {tasksLoading ? (
            <p className="text-sm">Loading tasks...</p>
          ) : tasksError ? (
            <p className="text-red-500 text-sm">Error loading tasks.</p>
          ) : (
            // Scroll only this section
            <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 80px)" }}>
              {tasksData?.getTasks
                ?.filter((task) => {
                  console.log("Comparing:", task.assignedStudent, "to", currUser.name);
                  return currUser.role === "admin" || task.assignedStudent === currUser.name;
                })
                .map((task) => (
                  <div
                    key={task.taskId}
                    className="bg-[#333] rounded-lg border border-[#027BFF] box-border"
                    style={{
                      padding: "2px 4px",
                    }}
                  >
                    <h4 className="text-lg font-semibold text-[#027BFF] truncate">
                      {task.taskName}
                    </h4>
                    <p className="text-sm text-gray-300 truncate">{task.description}</p>
                    <p className="text-sm mt-1"><strong>Status:</strong> {task.status}</p>
                    <p className="text-sm"><strong>Due:</strong> {task.dueDate}</p>
                    <p className="text-sm"><strong>Assigned to:</strong> {task.assignedStudent}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      {isSearchModalOpen && searchedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-[#333] p-6 rounded-[12px] w-full max-w-lg text-white">
            <h2 className="text-2xl text-[#027bff] font-bold mb-3">{searchedProject.title}</h2>
            <p className="mb-2">{searchedProject.description}</p>
            <p className="mb-1">
              <strong>Category:</strong> {searchedProject.category}
            </p>
            <p className="mb-1">
              <strong>Progress:</strong> {searchedProject.progress}%
            </p>
            <p className="mb-1">
              <strong>Students:</strong>{" "}
              {searchedProject.students
                .map(
                  (id) =>
                    studentsData.students.find((s) => s.stu_id === id)?.name || id
                )
                .join(", ")}
            </p>
            <p className="mb-1">
              <strong>Start Date:</strong> {searchedProject.startDate}
            </p>
            <p className="mb-1">
              <strong>End Date:</strong> {searchedProject.endDate}
            </p>

            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="mt-4 text-white border border-white px-4 py-2 rounded hover:text-[#00bfff] hover:border-[#00bfff]"
            >
              Close
            </button>
          </div>
        </div>
      )}


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-[#333] p-7 rounded-[12px] max-w-lg w-full text-white max-h-[80vh] overflow-y-auto shadow-lg">
            <h3 className="text-3xl mb-5 text-[#027BFF] text-center font-semibold">Add New Project</h3>

            <input
              name="title"
              value={newProject.title}
              onChange={handleChange}
              placeholder="Title"
              className="mb-4 w-full rounded-[12px] bg-[#555] p-3 text-white placeholder-gray-400 focus:outline-none"
            />

            <textarea
              name="description"
              value={newProject.description}
              onChange={handleChange}
              placeholder="Description"
              rows={3}
              className="mb-4 w-full rounded-[12px] bg-[#555] p-3 text-white placeholder-gray-400 focus:outline-none resize-none"
            />

            <select
              name="students"
              value={newProject.students}
              onChange={handleChange}
              multiple
              className="mb-4 w-full rounded-[12px] bg-[#555] p-3 text-white focus:outline-none"
              size={5}
            >
              {studentsData.students.map((stu) => (
                <option key={stu.stu_id} value={stu.name}>
                  {stu.name}
                </option>

              ))}
            </select>

            <select
              name="category"
              value={newProject.category}
              onChange={handleChange}
              className="mb-4 w-full rounded-[12px] bg-[#555] p-3 text-white focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              name="progress"
              type="number"
              min={0}
              max={100}
              value={newProject.progress}
              onChange={handleChange}
              placeholder="Progress %"
              className="mb-4 w-full rounded-[12px] bg-[#555] p-3 text-white focus:outline-none"
            />

            <input
              name="startDate"
              type="date"
              value={newProject.startDate}
              onChange={handleChange}
              className="mb-4 w-full rounded-[12px] bg-[#555] p-3 text-white focus:outline-none"
            />

            <input
              name="endDate"
              type="date"
              value={newProject.endDate}
              onChange={handleChange}
              className="mb-4 w-full rounded-[12px] bg-[#555] p-3 text-white focus:outline-none"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-[12px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="bg-[#027BFF] hover:bg-[#005fbb] px-5 py-2 rounded-[12px] font-semibold"
                disabled={adding}
              >
                {adding ? "Adding..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Projects;
