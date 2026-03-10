import "./ConfirmDialog.css";

// mode: "add" | "remove"
function ConfirmDialog({ book, mode, onConfirm, onCancel }) {
  if (!book) return null;

  const isRemove = mode === "remove";

  return (
    <div className="confirm-backdrop" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-cover-wrap">
          <img src={book.coverUrl} alt={book.title} className="confirm-cover" />
        </div>
        <div className="confirm-body">
          <h2 className="confirm-title">{book.title}</h2>
          <p className="confirm-author">{book.author}</p>
          <p className="confirm-question">
            {isRemove
              ? "Remove this book from your library?"
              : "Add this book to your library?"}
          </p>
          <div className="confirm-actions">
            <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button
              className={`confirm-btn ${isRemove ? "confirm-btn-remove" : "confirm-btn-add"}`}
              onClick={onConfirm}
            >
              {isRemove ? "Remove" : "Add to Library"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
