import "../styles/Header.css";
import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";

// const back=useNaviagate();

const Header = () => {
  const { currUser } = useContext(AppContext);
 
  const { setLogHome } = useContext(AppContext);
  return (
    <div className="header">
      <h3>
        {" "}
        {currUser.name}, {currUser.role}
        {currUser.role === "student" && `, ID: ${currUser.stu_id}`}
      </h3>
      <button
        onClick={() => {
          setLogHome(0);
        }}
      >
        Logout
      </button>
    </div>
  );
};
export default Header;
