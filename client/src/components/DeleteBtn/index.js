import React from "react";
import "./style.css";

function DeleteBtn(props) {
  return (
    <span className="delete-btn" {...props} role="button" tabIndex="0">
      UnBanish
    </span>
  );
}

export default DeleteBtn;
