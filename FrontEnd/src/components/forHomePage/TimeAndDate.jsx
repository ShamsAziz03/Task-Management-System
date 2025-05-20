import React, { useEffect, useState } from "react";

const TimeAndDate = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const myDate = new Date();
      const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const myDay = myDate.getDay();
      const dayNumber = myDate.getDate();
      const month = myDate.toLocaleString("default", { month: "long" });
      const year = myDate.getFullYear();
      let hours = myDate.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const minutes = myDate.getMinutes().toString().padStart(2, "0");
      const seconds = myDate.getSeconds().toString().padStart(2, "0");

      const myTime = `${weekday[myDay]}, ${month} ${dayNumber}, ${year} at ${hours}:${minutes}:${seconds} ${ampm}`;
      setTime(myTime);
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000); // update every second
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return <>{time}</>;
};

export default TimeAndDate;
