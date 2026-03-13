import { useEffect, useState } from "react";
import { getTopicWithQA, listTopics } from "./api.js";

function TopicsList() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listTopics();
      setTopics(data);
    } catch (err) {
      setError(err.message || "Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = topics.filter((t) =>
    t.topic_name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleClickTopic = async (topic) => {
    setSelected(null);
    setQaError("");
    setQaLoading(true);
    try {
      const data = await getTopicWithQA(topic.id);
      setSelected(data);
    } catch (err) {
      setQaError(err.message || "Failed to load Q&A");
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <section className="card topics-list">
      <div className="card-header">
        <h2>Topics in database</h2>
        <div className="card-header-actions">
          <input
            className="search-input"
            type="text"
            placeholder="Search topic…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
      {qaError && <p className="error">{qaError}</p>}
      {qaLoading && <p className="muted">Loading Q&amp;A…</p>}
      {selected && (
        <div className="qa-panel">
          <div className="qa-header">
            <div>
              <p className="qa-label">Selected topic</p>
              <h3>{selected.topic.topic_name}</h3>
            </div>
            <button type="button" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
          <ol className="qa-list">
            {selected.questions.map((q, index) => (
              <li key={q.id} className="qa-item">
                <span className="qa-index">{index + 1}.</span>
                <div>
                  <p className="qa-question">{q.question}</p>
                  <p className="qa-answer">{q.answer}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {!loading && !error && !topics.length && (
        <p className="muted">No topics found.</p>
      )}
      <ul>
        {filtered.map((t) => (
          <li
            key={t.id}
            className="topic-item"
            onClick={() => handleClickTopic(t)}
          >
            <div>
              <h3>{t.topic_name}</h3>
            </div>
            <div className="badge">View Q&amp;A</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="logo-dot" />
          <span>Topics Q&amp;A</span>
        </div>
        <div className="topbar-meta">
          <span className="muted">FastAPI · OpenAI · Supabase</span>
        </div>
      </header>

      <main className="layout single-column">
        <section className="right-column">
          <TopicsList />
        </section>
      </main>
    </div>
  );
}

