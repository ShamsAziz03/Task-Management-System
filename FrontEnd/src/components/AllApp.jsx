import React from "react";
import Header from "./Header";
import '../styles/AllApp.css';
import Asidebar from "./Asidebar";
import Content from "./Content";

const AllApp = () => {
  return (
    <div className="allApp">
    <Header />
    <Asidebar />
    <Content/>

    </div>
  );
};
export default AllApp;
