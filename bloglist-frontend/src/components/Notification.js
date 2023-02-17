import React from "react";
const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type === "update" ? "update" : "error"}>{message}</div>
  );
};
export default Notification;
