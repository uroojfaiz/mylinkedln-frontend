import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import SuggestionCard from "../components/SuggestionCard";

const SearchPage = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/search?q=${encodeURIComponent(q)}`).then(({ data }) => {
      setResults(data);
      setLoading(false);
    });
  }, [q]);

  return (
    <div>
      <Navbar />
      <div className="container" style={{ maxWidth: 620, padding: "20px 20px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 4 }}>
          Results for "{q}"
        </h2>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
          {loading ? "Searching..." : `${results.length} people found`}
        </p>

        <div className="card" style={{ padding: 8 }}>
          {!loading && results.length === 0 ? (
            <p style={{ padding: 30, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
              No one matches that search.
            </p>
          ) : (
            results.map((person) => (
              <div key={person._id} style={{ padding: "0 8px" }}>
                <SuggestionCard person={person} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
