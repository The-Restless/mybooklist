import { useState } from "react";
import "./bookcard.css";

const STATUS_LABELS = {
  "to-read": "To Read",
  reading: "Reading",
  completed: "Completed",
};

const STATUS_COLORS = {
  "to-read": "status-toread",
  reading: "status-reading",
  completed: "status-completed",
};

function StarRating({ rating, onRate }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star ${(hovered || rating || 0) >= star ? "filled" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onRate(star === rating ? null : star)}
          title={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function BookCard({ book, coverUrl, onStatusChange, onRatingChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const placeholderColor = stringToColor(book.title);

  return (
    <div className={`book-card ${expanded ? "expanded" : ""}`}>
      {/* Cover */}
      <div
        className="book-cover-wrap"
        onClick={() => setExpanded((v) => !v)}
        style={{ cursor: "pointer" }}
      >
        {coverUrl ? (
          <img
            className="book-cover-img"
            src={coverUrl}
            alt={book.title}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="book-cover-placeholder"
          style={{
            background: placeholderColor,
            display: coverUrl ? "none" : "flex",
          }}
        >
          <span className="placeholder-title">{book.title}</span>
          <span className="placeholder-author">{book.author}</span>
        </div>

        {/* Status badge */}
        <span className={`status-badge ${STATUS_COLORS[book.status]}`}>
          {STATUS_LABELS[book.status]}
        </span>

        {/* Completed overlay */}
        {book.status === "completed" && (
          <div className="completed-overlay">✓</div>
        )}
      </div>

      {/* Info */}
      <div className="book-info">
        <div className="book-title" title={book.title}>
          {book.title}
        </div>
        <div className="book-author">{book.author}</div>
        <div className="book-genre-tag">{book.genre}</div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="book-expanded">
          <div className="expanded-meta">
            <span>{book.publishYear}</span>
            {book.pageCount && <span>{book.pageCount} pp</span>}
            {book.seriesName && (
              <span className="series-tag">📚 {book.seriesName}</span>
            )}
          </div>

          {book.description && (
            <p className="expanded-desc">{book.description}</p>
          )}

          {/* Status selector */}
          <div className="status-select-wrap">
            <label className="field-label">Status</label>
            <select
              className="status-select"
              value={book.status}
              onChange={(e) => onStatusChange(book.id, e.target.value)}
            >
              <option value="to-read">To Read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Rating */}
          <div className="rating-wrap">
            <label className="field-label">Your Rating</label>
            <StarRating
              rating={book.userRating}
              onRate={(r) => onRatingChange(book.id, r)}
            />
          </div>

          {/* Delete */}
          {!showConfirmDelete ? (
            <button
              className="btn-delete"
              onClick={() => setShowConfirmDelete(true)}
            >
              🗑 Remove
            </button>
          ) : (
            <div className="delete-confirm">
              <span>Remove this book?</span>
              <div className="delete-confirm-btns">
                <button
                  className="btn-confirm-yes"
                  onClick={() => onDelete(book.id)}
                >
                  Yes
                </button>
                <button
                  className="btn-confirm-no"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 40%, 35%)`;
}

export default BookCard;
