import { useState } from "react";
import "./ReviewDialog.css";

function ReviewDialog({ book, onSave, onClose }) {
  const [ratingInput, setRatingInput] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [ratingError, setRatingError] = useState("");

  function handleRatingChange(e) {
    setRatingInput(e.target.value);
    setRatingError("");
  }

  function handleRatingBlur() {
    if (ratingInput === "") return;
    const parsed = parseFloat(ratingInput);

    if (isNaN(parsed)) {
      setRatingError("Please enter a number.");
      return;
    }
    if (parsed < 0 || parsed > 5) {
      setRatingError("Rating must be between 0 and 5.");
      return;
    }

    // Round to 1 decimal place
    const rounded = Math.round(parsed * 10) / 10;
    setRatingInput(String(rounded));
    setRatingError("");
  }

  function handleSubmit() {
    // Validate rating
    if (ratingInput === "") {
      setRatingError("Rating is required.");
      return;
    }

    const parsed = parseFloat(ratingInput);

    if (isNaN(parsed)) {
      setRatingError("Please enter a valid number.");
      return;
    }
    if (parsed < 0 || parsed > 5) {
      setRatingError("Rating must be between 0 and 5.");
      return;
    }

    const finalRating = Math.round(parsed * 10) / 10;
    onSave(book.isbn, finalRating, reviewText.trim());
  }

  // Live preview stars
  const previewRating = parseFloat(ratingInput);
  const validPreview = !isNaN(previewRating) && previewRating >= 0 && previewRating <= 5;

  return (
    <div className="review-backdrop" onClick={onClose}>
      <div className="review-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="review-header">
          <div>
            <h2 className="review-title">Write a Review</h2>
            <p className="review-book-name">{book.title}</p>
          </div>
          <button className="review-close" onClick={onClose}>✕</button>
        </div>

        <div className="review-body">
          {/* Rating */}
          <div className="field-group">
            <label className="field-label">
              Your Rating <span className="required">*</span>
            </label>
            <div className="rating-input-row">
              <input
                className={`field-input rating-input ${ratingError ? "field-error" : ""}`}
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={ratingInput}
                onChange={handleRatingChange}
                onBlur={handleRatingBlur}
                placeholder="e.g. 4.5"
              />
              <span className="rating-out-of">/ 5</span>
            </div>
            <span className="field-hint">
              Enter a number from 0 to 5. One decimal place max — we'll round for you if needed.
            </span>
            {ratingError && <span className="error-msg">{ratingError}</span>}

            {/* Star preview */}
            {validPreview && (
              <div className="star-preview">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`preview-star ${star <= Math.round(previewRating) ? "filled" : ""}`}
                  >
                    ★
                  </span>
                ))}
                <span className="preview-num">{(Math.round(previewRating * 10) / 10).toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Review text */}
          <div className="field-group">
            <label className="field-label">
              Review <span className="optional">(optional)</span>
            </label>
            <textarea
              className="field-input field-textarea"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you think of this book?"
              rows={5}
              maxLength={1000}
            />
            <span className="char-count">{reviewText.length} / 1000</span>
          </div>
        </div>

        <div className="review-footer">
          <button className="review-btn review-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="review-btn review-btn-save" onClick={handleSubmit}>
            Save Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewDialog;
