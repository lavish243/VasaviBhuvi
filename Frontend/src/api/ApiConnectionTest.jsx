
import { useEffect, useState } from "react";
import { getProjectContent } from "./contentService";

export default function ApiConnectionTest() {
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjectContent()
      .then(setProject)
      .catch((err) => {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to connect to the API"
        );
      });
  }, []);

  if (error) {
    return <p>API connection failed: {error}</p>;
  }

  if (!project) {
    return <p>Loading project data...</p>;
  }

  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.tagline}</p>
      <p>{project.description}</p>
    </div>
  );
}
