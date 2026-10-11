import { useEffect, useState } from "react";
import { getPageSection } from "../services/pageSectionService";

export default function usePageSection(sectionKey) {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSection() {
      setLoading(true);
      setError("");

      try {
        const data = await getPageSection(sectionKey);

        if (!cancelled) {
          setSection(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load section.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSection();

    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  return { section, loading, error };
}
