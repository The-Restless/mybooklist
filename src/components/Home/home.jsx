import { useState, useEffect } from "react";
import { top20Books } from "../../data/top20books";
import BookLogo from "../../assets/book-icon.svg";
import BookmarkIcon from "../../assets/bookmark-icon.svg";
import RemoveIcon from "../../assets/remove-icon.svg";
import AddIcon from "../../assets/add-icon.svg";
import GridIcon from "../../assets/grid-icon.svg";
import ListIcon from "../../assets/list-icon.svg";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./home.css";

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

function BookCard({ book, isInLibrary, onAdd, onRemove, viewMode }) {
  if (viewMode === "list") {
    return (
      <div className={`list-card ${isInLibrary ? "in-library" : ""}`}>
        <div className="list-cover-wrap">
          <img src={book.coverUrl} alt={book.title} className="list-cover" />
          {isInLibrary && (
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
          <StarRating rating={book.rating} />
          <p className="list-synopsis">{book.synopsis}</p>
          <div className="list-footer">
            {book.isOnAudible && (
              <span className="audible-badge">🎧 Audible</span>
            )}
            {isInLibrary ? (
              <button
                className="list-action-btn remove-btn"
                onClick={() => onRemove(book.isbn)}
              >
                <img src={RemoveIcon} alt="Remove" className="action-icon" />
                Remove from Library
              </button>
            ) : (
              <button
                className="list-action-btn add-btn"
                onClick={() => onAdd(book)}
              >
                <img src={AddIcon} alt="Add" className="action-icon" />
                Add to Library
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid card
  return (
    <div
      className={`book-card ${isInLibrary ? "in-library" : ""}`}
      data-title={book.title}
    >
      <img src={book.coverUrl} alt={book.title} className="book-cover" />

      {isInLibrary && (
        <img src={BookmarkIcon} alt="In Library" className="bookmark-badge" />
      )}

      <div className="add-overlay">
        {isInLibrary ? (
          <button className="add-book-btn" onClick={() => onRemove(book.isbn)}>
            <img src={RemoveIcon} alt="Remove Book" className="add-icon" />
            <span className="add-btn-tooltip">Remove from Library</span>
          </button>
        ) : (
          <button className="add-book-btn" onClick={() => onAdd(book)}>
            <img src={AddIcon} alt="Add Book Icon" className="add-icon" />
            <span className="add-btn-tooltip">Add to Library</span>
          </button>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [view, setView] = useState("library");
  const [viewMode, setViewMode] = useState("grid");
  const [myLibrary, setMyLibrary] = useState([]);
  const [pendingBook, setPendingBook] = useState(null);

  useEffect(() => {
    const savedLibrary = localStorage.getItem("myLibrary");
    if (savedLibrary) {
      setMyLibrary(JSON.parse(savedLibrary));
    }
  }, []);

  function isInLibrary(isbn) {
    return myLibrary.some((b) => b.isbn === isbn);
  }

  function handleAddClick(book) {
    setPendingBook(book);
  }

  function confirmAdd() {
    if (!pendingBook) return;
    const alreadyExists = myLibrary.some((b) => b.isbn === pendingBook.isbn);
    if (!alreadyExists) {
      const updatedLibrary = [...myLibrary, pendingBook];
      setMyLibrary(updatedLibrary);
      localStorage.setItem("myLibrary", JSON.stringify(updatedLibrary));
    }
    setPendingBook(null);
  }

  function cancelAdd() {
    setPendingBook(null);
  }

  function removeBookFromLibrary(isbn) {
    const updatedLibrary = myLibrary.filter((book) => book.isbn !== isbn);
    setMyLibrary(updatedLibrary);
    localStorage.setItem("myLibrary", JSON.stringify(updatedLibrary));
  }

  const displayedBooks = view === "library" ? myLibrary : top20Books;

  return (
    <div className="main">
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

        <div className="content-area">
          {view === "library" && myLibrary.length === 0 && (
            <p className="empty-msg">
              Your library is empty. Browse to add books!
            </p>
          )}

          {viewMode === "grid" ? (
            <div className="grid-container">
              {displayedBooks.map((book) => (
                <BookCard
                  key={book.isbn}
                  book={book}
                  isInLibrary={isInLibrary(book.isbn)}
                  onAdd={handleAddClick}
                  onRemove={removeBookFromLibrary}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="list-container">
              {displayedBooks.map((book) => (
                <BookCard
                  key={book.isbn}
                  book={book}
                  isInLibrary={isInLibrary(book.isbn)}
                  onAdd={handleAddClick}
                  onRemove={removeBookFromLibrary}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        book={pendingBook}
        onConfirm={confirmAdd}
        onCancel={cancelAdd}
      />
    </div>
  );
}

export default Home;
