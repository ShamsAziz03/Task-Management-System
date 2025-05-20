import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";

import Home from "./Home";
import Tasks from "./Tasks";
import NewTask from "./forTasksPage/NewTask";
 import Projects from "./Projects";
 import Chat from "./Chat.jsx";
const Content = () => {
  const { PageNum } = useContext(AppContext);
  const { newTask } = useContext(AppContext);

  const renderPage = () => {
    switch (PageNum) {
      case 1:
        return <Home />;
      case 2: {
        if (newTask === 0) {
          return <Tasks />;
        }
        else{ return <NewTask />; }
      }

         case 3:
          return <Projects />;
        case 4:
         return <Chat />;
      default:
        return <div>Page not found</div>;
    }
  };

  return <>{renderPage()}</>;
};

export default Content;
