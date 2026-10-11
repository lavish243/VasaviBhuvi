import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <section className="not-found">
      <div className="not-found-content">
        <span className="not-found-code">404</span>

        <h1>Page Not Found</h1>

        <p>
          The page you are looking for doesn't exist or may have been moved.
        </p>

        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;