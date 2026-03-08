import { useState } from "react";
import BookCard from "../BookCard/BookCard";
import "./seriesgroup.css";

function SeriesGroup({ name, books, coverCache, onStatusChange, onRatingChange, onDelete, isStandalone }) {
  const [collapsed, setCollapsed] = useState(false);

  const ratedBooks = books.filter((b) => b.userRating !== null);
  const avgRating =
    ratedBooks.length > 0
      ? (ratedBooks.reduce((sum, b) => sum + b.userRating, 0) / ratedBooks.length).toFixed(1)
      : null;

  const completedCount = books.filter((b) => b.status === "completed").length;

  return (
    <div className="series-group">
      <div
        className="series-header"
        onClick={() => setCollapsed((v) => !v)}
      >
        <div className="series-header-left">
          <span className="series-collapse-icon">{collapsed ? "▶" : "▼"}</span>
          <div>
            <div className="series-name">
              {isStandalone ? "📖 Standalone" : `📚 ${name}`}
            </div>
            <div className="series-meta">
              <span>{books.length} book{books.length !== 1 ? "s" : ""}</span>
              <span className="series-dot">·</span>
              <span>{completedCount} completed</span>
              {avgRating && (
                <>
                  <span className="series-dot">·</span>
                  <span className="series-avg-rating">★ {avgRating} avg</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="series-progress-wrap">
          <div className="series-progress-bar">
            <div
              className="series-progress-fill"
              style={{ width: `${(completedCount / books.length) * 100}%` }}
            />
          </div>
          <span className="series-progress-text">
            {completedCount}/{books.length}
          </span>
        </div>
      </div>

      {!collapsed && (
        <div className="series-books">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              coverUrl={coverCache[book.isbn]}
              onStatusChange={onStatusChange}
              onRatingChange={onRatingChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SeriesGroup;
