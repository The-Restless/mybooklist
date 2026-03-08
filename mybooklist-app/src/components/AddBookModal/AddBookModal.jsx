import { useState } from "react";
import "./addbook.css";

const GENRES = [
  "Science Fiction",
  "Fantasy",
  "Dystopian Fiction",
  "Classic Literature",
  "Historical Fiction",
  "Mystery",
  "Thriller",
  "Non-Fiction",
  "Biography",
  "Romance",
  "Horror",
  "Self-Help",
  "Other",
];

function AddBookModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "Science Fiction",
    publishYear: "",
    pageCount: "",
    description: "",
    seriesName: "",
    isbn: "",
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.author.trim()) errs.author = "Author is required";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onAdd({
      ...form,
      publishYear: form.publishYear ? parseInt(form.publishYear) : null,
      pageCount: form.pageCount ? parseInt(form.pageCount) : null,
      seriesName: form.seriesName.trim() || null,
      isbn: form.isbn.trim() || null,
    });
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add a Book</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field-group">
            <label className="modal-label">
              Title <span className="required">*</span>
            </label>
            <input
              className={`modal-input ${errors.title ? "error" : ""}`}
              type="text"
              placeholder="e.g. The Great Gatsby"
              value={form.title}
              onChange={set("title")}
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          <div className="field-group">
            <label className="modal-label">
              Author <span className="required">*</span>
            </label>
            <input
              className={`modal-input ${errors.author ? "error" : ""}`}
              type="text"
              placeholder="e.g. F. Scott Fitzgerald"
              value={form.author}
              onChange={set("author")}
            />
            {errors.author && <span className="error-msg">{errors.author}</span>}
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="modal-label">Genre</label>
              <select className="modal-input" value={form.genre} onChange={set("genre")}>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="modal-label">Year Published</label>
              <input
                className="modal-input"
                type="number"
                placeholder="e.g. 2024"
                value={form.publishYear}
                onChange={set("publishYear")}
                min="1000"
                max="2100"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="modal-label">Page Count</label>
              <input
                className="modal-input"
                type="number"
                placeholder="e.g. 320"
                value={form.pageCount}
                onChange={set("pageCount")}
                min="1"
              />
            </div>

            <div className="field-group">
              <label className="modal-label">ISBN (for cover)</label>
              <input
                className="modal-input"
                type="text"
                placeholder="e.g. 9780743273565"
                value={form.isbn}
                onChange={set("isbn")}
              />
            </div>
          </div>

          <div className="field-group">
            <label className="modal-label">Series Name</label>
            <input
              className="modal-input"
              type="text"
              placeholder="e.g. Dune Chronicles (optional)"
              value={form.seriesName}
              onChange={set("seriesName")}
            />
          </div>

          <div className="field-group">
            <label className="modal-label">Description</label>
            <textarea
              className="modal-input modal-textarea"
              placeholder="Brief description..."
              value={form.description}
              onChange={set("description")}
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit}>Add Book</button>
        </div>
      </div>
    </div>
  );
}

export default AddBookModal;
