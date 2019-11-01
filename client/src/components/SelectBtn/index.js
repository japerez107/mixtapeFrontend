import React from "react";
import "./style.css";

function SelectBtn(props) {
  return (
    <span className="select-btn" {...props} role="button" tabIndex="0">
      Select
    </span>
  );
}

export default SelectBtn;
