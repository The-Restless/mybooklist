import { useState, useEffect, useRef, useCallback } from "react";
import { top20Books } from "../../data/top20books";
import BookCard from "../BookCard/BookCard";
import AddBookModal from "../AddBookModal/AddBookModal";
import Confetti from "../Confetti/Confetti";
import SeriesGroup from "../SeriesGroup/SeriesGroup";
import "./home.css";

const STATUS_OPTIONS = ["all", "to-read", "reading", "completed"];
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "author-asc", label: "Author A–Z" },
  { value: "rating-desc", label: "Rating ↓" },
  { value: "year-desc", label: "Year ↓" },
  { value: "year-asc", label: "Year ↑" },
];

function Home() {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("mybooklist-books");
    return saved ? JSON.parse(saved) : top20Books;
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [genreFilter, setGenreFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid | series
  const [completedBookTitle, setCompletedBookTitle] = useState("");
  const nextId = useRef(Math.max(...top20Books.map((b) => b.id)) + 1);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("mybooklist-books", JSON.stringify(books));
  }, [books]);

  // Cover cache: isbn -> url
  const [coverCache, setCoverCache] = useState({});

  const fetchCover = useCallback(
    (isbn) => {
      if (!isbn || coverCache[isbn] !== undefined) return;
      setCoverCache((prev) => ({ ...prev, [isbn]: null })); // mark as loading
      fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
      )
        .then((r) => r.json())
        .then((data) => {
          const key = `ISBN:${isbn}`;
          const cover =
            data[key]?.cover?.medium || data[key]?.cover?.small || null;
          setCoverCache((prev) => ({ ...prev, [isbn]: cover }));
        })
        .catch(() => {
          setCoverCache((prev) => ({ ...prev, [isbn]: null }));
        });
    },
    [coverCache],
  );

  // Fetch covers for visible books
  useEffect(() => {
    books.forEach((b) => {
      if (b.isbn) fetchCover(b.isbn);
    });
  }, [books]);

  const allGenres = ["all", ...new Set(books.map((b) => b.genre))];

  const handleStatusChange = (id, newStatus) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        if (newStatus === "completed" && b.status !== "completed") {
          setCompletedBookTitle(b.title);
          setConfetti(true);
          setTimeout(() => setConfetti(false), 4000);
        }
        return { ...b, status: newStatus };
      }),
    );
  };

  const handleRatingChange = (id, rating) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, userRating: rating } : b)),
    );
  };

  const handleDelete = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddBook = (newBook) => {
    const book = {
      ...newBook,
      id: nextId.current++,
      status: "to-read",
      userRating: null,
    };
    setBooks((prev) => [book, ...prev]);
    setShowAddModal(false);
    if (book.isbn) fetchCover(book.isbn);
  };

  // Filter + sort
  const filtered = books
    .filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchGenre = genreFilter === "all" || b.genre === genreFilter;
      return matchSearch && matchStatus && matchGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "author-asc":
          return a.author.localeCompare(b.author);
        case "rating-desc":
          return (b.userRating || 0) - (a.userRating || 0);
        case "year-desc":
          return b.publishYear - a.publishYear;
        case "year-asc":
          return a.publishYear - b.publishYear;
        default:
          return 0;
      }
    });

  // Group by series
  const seriesGroups = {};
  const standalone = [];
  filtered.forEach((b) => {
    if (b.seriesName) {
      if (!seriesGroups[b.seriesName]) seriesGroups[b.seriesName] = [];
      seriesGroups[b.seriesName].push(b);
    } else {
      standalone.push(b);
    }
  });

  const statusCounts = {
    all: books.length,
    "to-read": books.filter((b) => b.status === "to-read").length,
    reading: books.filter((b) => b.status === "reading").length,
    completed: books.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="app">
      {confetti && <Confetti bookTitle={completedBookTitle} />}

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">MyBookList</span>
          </div>
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            + Add Book
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="stats-bar">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            className={`stat-pill ${statusFilter === s ? "active" : ""} status-${s}`}
            onClick={() => setStatusFilter(s)}
          >
            <span className="stat-label">
              {s === "all"
                ? "All"
                : s === "to-read"
                  ? "To Read"
                  : s === "reading"
                    ? "Reading"
                    : "Completed"}
            </span>
            <span className="stat-count">{statusCounts[s]}</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-row">
          <select
            className="select-ctrl"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g === "all" ? "All Genres" : g}
              </option>
            ))}
          </select>

          <select
            className="select-ctrl"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === "series" ? "active" : ""}`}
              onClick={() => setViewMode("series")}
              title="Series view"
            >
              ≡
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-meta">
        {filtered.length === 0
          ? "No books found"
          : `${filtered.length} book${filtered.length !== 1 ? "s" : ""}`}
        {search && ` matching "${search}"`}
      </div>

      {/* Book Grid or Series View */}
      <main className="main-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <p>No books found. Try adjusting your filters or add a new book!</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="book-grid">
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                coverUrl={coverCache[book.isbn]}
                onStatusChange={handleStatusChange}
                onRatingChange={handleRatingChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="series-view">
            {Object.entries(seriesGroups).map(([name, seriesBooks]) => (
              <SeriesGroup
                key={name}
                name={name}
                books={seriesBooks}
                coverCache={coverCache}
                onStatusChange={handleStatusChange}
                onRatingChange={handleRatingChange}
                onDelete={handleDelete}
              />
            ))}
            {standalone.length > 0 && (
              <SeriesGroup
                name="Standalone Books"
                books={standalone}
                coverCache={coverCache}
                onStatusChange={handleStatusChange}
                onRatingChange={handleRatingChange}
                onDelete={handleDelete}
                isStandalone
              />
            )}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddBookModal
          onAdd={handleAddBook}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default Home;
