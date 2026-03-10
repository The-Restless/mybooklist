import { useState, useEffect } from "react";
import { top20Books } from "../../data/top20books";
import BookLogo from "../../assets/book-icon.svg";
import BookmarkIcon from "../../assets/bookmark-icon.svg";
import RemoveIcon from "../../assets/remove-icon.svg";
import PlusIcon from "../../assets/plus-icon.svg";
import GridIcon from "../../assets/grid-icon.svg";
import ListIcon from "../../assets/list-icon.svg";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import BookInfoModal from "../BookInfoModal/BookInfoModal";
import AddBookModal from "../AddBookModal/AddBookModal";
import ReviewDialog from "../ReviewDialog/ReviewDialog";
import "./home.css";

const STATUS_META = {
  "to-read": { label: "To Read", className: "badge-to-read" },
  reading: { label: "Reading", className: "badge-reading" },
  completed: { label: "Completed", className: "badge-completed" },
};

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= Math.round(rating) ? "filled" : ""}`}
        >
          ★
        </span>
      ))}
      <span className="rating-num">{rating.toFixed(1)}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  if (!status) return null;
  const meta = STATUS_META[status];
  return <span className={`status-badge ${meta.className}`}>{meta.label}</span>;
}

function BookCard({
  book,
  isInLibrary,
  isBrowse,
  onCardClick,
  onQuickRemove,
  viewMode,
}) {
  if (viewMode === "list") {
    return (
      <div className="list-card" onClick={() => onCardClick(book)}>
        <div className="list-cover-wrap">
          <img
            src={book.coverUrl}
            alt={book.title}
            className={`list-cover ${isBrowse && isInLibrary ? "cover-dimmed" : ""}`}
          />
          {isBrowse && isInLibrary && (
            <img
              src={BookmarkIcon}
              alt="In Library"
              className="list-bookmark-icon"
            />
          )}
        </div>
        <div className="list-divider" />
        <div className="list-info">
          <div className="list-info-top">
            <div>
              <h3 className="list-title">{book.title}</h3>
              <p className="list-author">by {book.author}</p>
            </div>
            <div className="list-meta">
              <span className="list-genre">{book.genre}</span>
              {book.rank && <span className="list-rank">#{book.rank}</span>}
            </div>
          </div>
          <StarRating rating={book.userRating ?? book.rating} />
          <div className="list-footer-row">
            {book.isOnAudible && (
              <span className="audible-badge">🎧 Audible</span>
            )}
            {!isBrowse && book.status && <StatusBadge status={book.status} />}
          </div>
          <p className="list-synopsis">{book.synopsis}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="book-card"
      data-title={book.title}
      onClick={() => onCardClick(book)}
    >
      <img
        src={book.coverUrl}
        alt={book.title}
        className={`book-cover ${isBrowse && isInLibrary ? "cover-dimmed" : ""}`}
      />
      {isBrowse && isInLibrary && (
        <img src={BookmarkIcon} alt="In Library" className="bookmark-badge" />
      )}
      {!isBrowse && book.status && <StatusBadge status={book.status} />}
      {!isBrowse && (
        <div className="remove-overlay">
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickRemove(book);
            }}
          >
            <img src={RemoveIcon} alt="Remove" className="remove-icon" />
            <span className="remove-tooltip">Remove from Library</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState("library");
  const [viewMode, setViewMode] = useState("grid");
  const [myLibrary, setMyLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");

  const [selectedBook, setSelectedBook] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewBook, setReviewBook] = useState(null);

  // Simple completion banner — true means it's visible
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("myLibrary");
    if (saved) setMyLibrary(JSON.parse(saved));
  }, []);

  function saveLibrary(updated) {
    setMyLibrary(updated);
    localStorage.setItem("myLibrary", JSON.stringify(updated));
  }

  function isInLibrary(isbn) {
    return myLibrary.some((b) => b.isbn === isbn);
  }

  function handleStatusChange(isbn, newStatus) {
    const book = myLibrary.find((b) => b.isbn === isbn);
    const wasCompleted = book?.status === "completed";
    const nowCompleted = newStatus === "completed";

    const updated = myLibrary.map((b) =>
      b.isbn === isbn ? { ...b, status: newStatus } : b,
    );
    saveLibrary(updated);

    if (selectedBook?.isbn === isbn) {
      setSelectedBook((prev) => ({ ...prev, status: newStatus }));
    }

    // Show the banner only when transitioning TO completed for the first time
    if (!wasCompleted && nowCompleted) {
      setShowBanner(true);
      // Hide it after 2 seconds
      setTimeout(() => setShowBanner(false), 2000);
    }
  }

  function handleCardClick(book) {
    const libraryVersion = myLibrary.find((b) => b.isbn === book.isbn);
    setSelectedBook(libraryVersion ?? book);
  }

  function closeModal() {
    setSelectedBook(null);
  }
  function handleAddClick() {
    setConfirmState({ book: selectedBook, mode: "add" });
  }
  function handleRemoveClick() {
    setConfirmState({ book: selectedBook, mode: "remove" });
  }
  function handleQuickRemove(book) {
    setConfirmState({ book, mode: "remove" });
  }
  function handleReview() {
    setReviewBook(selectedBook);
  }

  function handleConfirm() {
    const { book, mode } = confirmState;
    if (mode === "add") {
      if (!isInLibrary(book.isbn)) {
        saveLibrary([...myLibrary, { ...book, status: "to-read" }]);
      }
    } else {
      saveLibrary(myLibrary.filter((b) => b.isbn !== book.isbn));
    }
    setConfirmState(null);
    setSelectedBook(null);
  }

  function handleConfirmCancel() {
    setConfirmState(null);
  }

  function handleAddCustomBook(book) {
    saveLibrary([...myLibrary, { ...book, status: "to-read" }]);
    setShowAddModal(false);
  }

  function handleSaveReview(isbn, rating, reviewText) {
    const updated = myLibrary.map((b) =>
      b.isbn === isbn
        ? { ...b, userRating: rating, userReview: reviewText }
        : b,
    );
    saveLibrary(updated);
    setReviewBook(null);
    setSelectedBook(null);
  }

  function matchesSearch(book) {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  }

  function applySorting(books) {
    if (sortBy === "none") return books;
    return books.slice().sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "genre") return a.genre.localeCompare(b.genre);
      if (sortBy === "rating")
        return (b.userRating ?? b.rating) - (a.userRating ?? a.rating);
      if (sortBy === "rank") return (a.rank ?? 999) - (b.rank ?? 999);
      if (sortBy === "audible")
        return (b.isOnAudible ? 1 : 0) - (a.isOnAudible ? 1 : 0);
      if (sortBy === "status") {
        const order = { reading: 0, "to-read": 1, completed: 2 };
        return (order[a.status] ?? 3) - (order[b.status] ?? 3);
      }
      return 0;
    });
  }

  const isBrowse = view === "browse";
  const baseBooks = isBrowse ? top20Books : myLibrary;
  const displayedBooks = applySorting(baseBooks.filter(matchesSearch));

  return (
    <div className="main">
      {/* Completion banner — only rendered when showBanner is true */}
      {showBanner && (
        <div className="completion-banner">✓ Marked as completed!</div>
      )}

      <header className="header">
        <div className="logo-container">
          <img src={BookLogo} alt="Logo" className="nav-icon" />
          <span className="main-logo">MyBookList</span>
        </div>
      </header>

      <div className="main-content">
        <div className="toolbar">
          <nav className="select-focus">
            <button
              className={view === "library" ? "active" : ""}
              onClick={() => setView("library")}
            >
              My Library
            </button>
            <button
              className={view === "browse" ? "active" : ""}
              onClick={() => setView("browse")}
            >
              Browse
            </button>
          </nav>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <img src={GridIcon} alt="Grid view" className="view-icon" />
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <img src={ListIcon} alt="List view" className="view-icon" />
            </button>
          </div>
        </div>

        <div className="search-sort-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search by title or author…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="none">Sort by…</option>
            <option value="rank">Best Selling (Rank)</option>
            <option value="title">Title (A–Z)</option>
            <option value="author">Author (A–Z)</option>
            <option value="genre">Genre (A–Z)</option>
            <option value="rating">Rating (High–Low)</option>
            <option value="audible">Audible first</option>
            {!isBrowse && <option value="status">Status</option>}
          </select>
        </div>

        <div className="content-area">
          {viewMode === "grid" ? (
            <div className="grid-container">
              {!isBrowse && (
                <div
                  className="book-card add-card"
                  onClick={() => setShowAddModal(true)}
                >
                  <div className="plus-symbol">
                    <img src={PlusIcon} alt="Add" className="nav-icon" />
                  </div>
                  <div className="add-text">Add book to library</div>
                </div>
              )}
              {myLibrary.length === 0 && !isBrowse && (
                <p className="empty-msg">
                  Your library is empty. Add some books!
                </p>
              )}
              {displayedBooks.length === 0 && searchTerm && (
                <p className="empty-msg">No books match "{searchTerm}".</p>
              )}
              {displayedBooks.map((book) => (
                <BookCard
                  key={book.isbn}
                  book={book}
                  isInLibrary={isInLibrary(book.isbn)}
                  isBrowse={isBrowse}
                  onCardClick={handleCardClick}
                  onQuickRemove={handleQuickRemove}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="list-container">
              {!isBrowse && (
                <div
                  className="list-add-card"
                  onClick={() => setShowAddModal(true)}
                >
                  <img src={PlusIcon} alt="Add" className="list-add-icon" />
                  <span>Add book to library</span>
                </div>
              )}
              {myLibrary.length === 0 && !isBrowse && (
                <p className="empty-msg">
                  Your library is empty. Browse to add books!
                </p>
              )}
              {displayedBooks.length === 0 && searchTerm && (
                <p className="empty-msg">No books match "{searchTerm}".</p>
              )}
              {displayedBooks.map((book) => (
                <BookCard
                  key={book.isbn}
                  book={book}
                  isInLibrary={isInLibrary(book.isbn)}
                  isBrowse={isBrowse}
                  onCardClick={handleCardClick}
                  onQuickRemove={handleQuickRemove}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedBook && !confirmState && !reviewBook && (
        <BookInfoModal
          book={selectedBook}
          isInLibrary={isInLibrary(selectedBook.isbn)}
          onAdd={handleAddClick}
          onRemove={handleRemoveClick}
          onReview={handleReview}
          onStatusChange={handleStatusChange}
          onClose={closeModal}
        />
      )}

      {confirmState && (
        <ConfirmDialog
          book={confirmState.book}
          mode={confirmState.mode}
          onConfirm={handleConfirm}
          onCancel={handleConfirmCancel}
        />
      )}

      {showAddModal && (
        <AddBookModal
          onSave={handleAddCustomBook}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {reviewBook && (
        <ReviewDialog
          book={reviewBook}
          onSave={handleSaveReview}
          onClose={() => setReviewBook(null)}
        />
      )}
    </div>
  );
}
