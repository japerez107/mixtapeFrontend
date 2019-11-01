import React from "react";

function SearchForm(props) {
  return (
    <form>
      <div className="form-group">
        <label htmlFor="search"><h3 style={{backgroundColor: "coral"}}>{props.description}</h3></label>
        <input
          onChange={props.handleInputChange}
          value={props.value}
          name={props.name}
          type="text"
          className="form-control"
          placeholder={props.placeholder}
        />
        <br />
        <button onClick={props.handleFormSubmit} className="btn btn-primary">
          {props.buttonText}
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
