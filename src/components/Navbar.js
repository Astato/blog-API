import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
const Navbar = ({ clientLogged }) => {
  return (
    <nav id="navbar">
      <h1>
        <Link to="/">D.ISC |</Link>
      </h1>
      <ul>
        <li>
          <Link to="/"> Home |</Link>
        </li>
        <li>
          <Link to="/discover"> Discover | </Link>
        </li>
        <li>
          <Link to="/create">Create |</Link>
        </li>
        {/* <li>
          <Link>Github |</Link>
        </li> */}
        <li id="google_translate_element"></li>
        <li>
          {clientLogged ? (
            <Link to={"/profile/" + clientLogged.name + clientLogged.lastname}>
              Profile |
            </Link>
          ) : (
            <Link to="/sign-in">Sign In |</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
