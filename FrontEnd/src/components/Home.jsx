import React from "react";
import '../styles/Home.css';
import TimeAndDate from "./forHomePage/TimeAndDate";
import Chart from "./forHomePage/Chart";
import Statistics from "./forHomePage/Statistics";

const Home = () => {
  return (
    <div id="content">
      <div>
        <h1>Welcome to the Task Management System</h1>
        <h4 id="time_and_date"><TimeAndDate /></h4>
      </div>

     <Statistics />

      <div>
        <Chart />
      </div>
    </div>
  );
};
export default Home;
