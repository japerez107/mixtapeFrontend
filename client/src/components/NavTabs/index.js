import React from "react";
import "./style.css";
// import { Link } from "react-router-dom";


let func1 = () => {
window.open('https://accounts.spotify.com/en/logout', '_blank' )
}

let func2 = () => {
  window.location = window.location.origin
}


function NavTabs() {
  return (
    <ul className="nav nav-tabs">
      {/* <li className="nav-item">
        <Link
          to="/"
          className={window.location.pathname === "/" ? "nav-link active" : "nav-link"}
        >
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/search" className={window.location.pathname === "/" ? "nav-link active" : "nav-link"}>
          Spotify Sign Out
        </Link>
      </li> */}
      <li className="nav-item">
        <button className="signout" onClick={function(event){ func1(); func2()}}>Spotify Sign Out
         </button>
      </li>
    </ul>
  );
}

export default NavTabs;
