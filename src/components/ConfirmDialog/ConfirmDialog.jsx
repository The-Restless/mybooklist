import "./ConfirmDialog.css";

function ConfirmDialog({ book, onConfirm, onCancel }) {
  if (!book) return null;

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-cover-wrap">
          <img src={book.coverUrl} alt={book.title} className="dialog-cover" />
        </div>
        <div className="dialog-body">
          <h2 className="dialog-title">{book.title}</h2>
          <p className="dialog-author">{book.author}</p>
          <p className="dialog-genre">{book.genre}</p>
          <p className="dialog-synopsis">{book.synopsis}</p>
          <div className="dialog-actions">
            <button className="dialog-btn dialog-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="dialog-btn dialog-btn-confirm" onClick={onConfirm}>
              Add to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
