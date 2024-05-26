import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div id="error-page">
      <h1>Oops! Page Not Found!</h1>
      <p>
        The page you are looking for doesn't exist anymore or is temporarily
        unavailable.
      </p>
      <Link to="/">
        <button>Back home</button>
      </Link>
    </div>
  );
};

export default ErrorPage;
