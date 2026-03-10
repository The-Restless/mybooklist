import RemoveIcon from "../../assets/remove-icon.svg";
import AddIcon from "../../assets/add-icon.svg";
import "./BookInfoModal.css";

// The three statuses in display order
const STATUSES = [
  { value: "to-read",   label: "To Read"   },
  { value: "reading",   label: "Reading"   },
  { value: "completed", label: "Completed" },
];

function StarRating({ rating }) {
  return (
    <div className="modal-star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`modal-star ${star <= Math.round(rating) ? "filled" : ""}`}>
          ★
        </span>
      ))}
      <span className="modal-rating-num">{rating.toFixed(1)}</span>
    </div>
  );
}

// Props:
//   book          — the full book object (may include status, userRating, userReview)
//   isInLibrary   — boolean
//   onAdd         — called when user clicks Add to Library
//   onRemove      — called when user clicks Remove
//   onReview      — called when user clicks Write a Review
//   onStatusChange(isbn, newStatus) — called when user picks a status
//   onClose       — close the modal
function BookInfoModal({ book, isInLibrary, onAdd, onRemove, onReview, onStatusChange, onClose }) {
  if (!book) return null;

  const displayRating = book.userRating ?? book.rating;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-cover-wrap">
          <img src={book.coverUrl} alt={book.title} className="modal-cover" />
        </div>

        <div className="modal-body">
          <div className="modal-header">
            <div>
              <h2 className="modal-title">{book.title}</h2>
              <p className="modal-author">by {book.author}</p>
            </div>
            <div className="modal-meta">
              <span className="modal-genre">{book.genre}</span>
              {book.rank && <span className="modal-rank">#{book.rank}</span>}
            </div>
          </div>

          <StarRating rating={displayRating} />

          {book.isOnAudible && (
            <span className="modal-audible">🎧 Available on Audible</span>
          )}

          <p className="modal-synopsis">{book.synopsis}</p>

          {/* Status toggle — only shown for books in the library */}
          {isInLibrary && (
            <div className="modal-status-section">
              <p className="modal-status-label">Reading Status</p>
              <div className="modal-status-toggle">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    className={`status-btn status-btn-${s.value} ${book.status === s.value ? "active" : ""}`}
                    onClick={() => onStatusChange(book.isbn, s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Saved review — show if the user has left one */}
          {book.userReview || book.userRating != null ? (
            <div className="modal-review-section">
              <p className="modal-review-label">Your Review</p>
              {book.userRating != null && (
                <div className="modal-user-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`modal-star ${star <= Math.round(book.userRating) ? "filled" : ""}`}>
                      ★
                    </span>
                  ))}
                  <span className="modal-rating-num">{book.userRating.toFixed(1)} / 5</span>
                </div>
              )}
              {book.userReview && (
                <p className="modal-review-text">"{book.userReview}"</p>
              )}
            </div>
          ) : null}

          <div className="modal-actions">
            {isInLibrary ? (
              <button className="modal-btn modal-btn-remove" onClick={onRemove}>
                <img src={RemoveIcon} alt="Remove" className="modal-btn-icon" />
                Remove from Library
              </button>
            ) : (
              <button className="modal-btn modal-btn-add" onClick={onAdd}>
                <img src={AddIcon} alt="Add" className="modal-btn-icon" />
                Add to Library
              </button>
            )}

            {/* Review button only makes sense for library books */}
            {isInLibrary && (
              <button className="modal-btn modal-btn-review" onClick={onReview}>
                ✏️ {book.userReview ? "Edit Review" : "Write a Review"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookInfoModal;
