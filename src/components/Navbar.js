import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
const Navbar = ({ clientLogged }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth < 680);
    }, 100);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav
      id="navbar"
      className={
        !isMobile ? "" : expanded ? "navbar-expanded" : "navbar-closed"
      }
    >
      <h1>
        <Link to="/">D.ISC |</Link>
      </h1>
      <ul
        style={{
          padding: isMobile && 0,
          margin: isMobile && " 1rem",
          fontSize: isMobile && "30px",
        }}
      >
        {isMobile && (
          <li style={{ display: isMobile && "block", margin: "0" }}>
            <Link onClick={() => setExpanded(!expanded)}>☰</Link>
          </li>
        )}
        <li>
          <Link to="/" onClick={() => setExpanded(false)}>
            Home |
          </Link>
        </li>
        <li>
          <Link onClick={() => setExpanded(false)} to="/discover">
            {" "}
            Discover |
          </Link>
        </li>
        <li>
          <Link onClick={() => setExpanded(false)} to="/create">
            Create |
          </Link>
        </li>
        {/* <li>
          <Link>Github |</Link>
        </li> */}
        <li id="google_translate_element"></li>
        <li onClick={() => setExpanded(false)}>
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
