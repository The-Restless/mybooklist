import { useState } from "react";
import "./AddBookModal.css";

const GENRES = [
  "Literary Fiction", "Historical Fiction", "Historical Fantasy",
  "Fantasy", "Dark Fantasy", "Sci-Fi", "Sci-Fi / LitRPG",
  "Thriller", "Crime Thriller", "Action Thriller", "Historical Thriller",
  "Psychological Thriller", "Legal Thriller", "Romance", "Sports Romance",
  "Rom-Com", "Non-Fiction", "Contemporary Fiction", "Fiction", "Other",
];

const EMPTY = { title: "", author: "", genre: "", synopsis: "", coverUrl: "", isOnAudible: false };

function AddBookModal({ onSave, onClose }) {
  const [fields, setFields]   = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    // checkboxes use "checked", everything else uses "value"
    const newValue = type === "checkbox" ? checked : value;
    setFields((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, fields[name]);
  }

  function validateField(name, value) {
    let error = "";
    if (name === "title"    && !value.trim()) error = "Title is required.";
    if (name === "author"   && !value.trim()) error = "Author name is required.";
    if (name === "genre"    && !value)        error = "Please select a genre.";
    if (name === "synopsis" && !value.trim()) error = "Synopsis is required.";
    if (name === "coverUrl" && value.trim()) {
      try { new URL(value.trim()); }
      catch { error = "Must be a valid URL (e.g. https://example.com/cover.jpg)"; }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  }

  function handleSubmit() {
    const newErrors = {
      title:    validateField("title",    fields.title)    || "",
      author:   validateField("author",   fields.author)   || "",
      genre:    validateField("genre",    fields.genre)    || "",
      synopsis: validateField("synopsis", fields.synopsis) || "",
      coverUrl: fields.coverUrl.trim() ? (validateField("coverUrl", fields.coverUrl) || "") : "",
    };

    setTouched({ title: true, author: true, genre: true, synopsis: true, coverUrl: true });

    if (Object.values(newErrors).some((e) => e)) return;

    onSave({
      isbn:       `custom-${Date.now()}`,
      title:      fields.title.trim(),
      author:     fields.author.trim(),
      genre:      fields.genre,
      synopsis:   fields.synopsis.trim(),
      coverUrl:   fields.coverUrl.trim() || null,
      isOnAudible: fields.isOnAudible,
      rating:     0,
      rank:       null,
    });
  }

  return (
    <div className="add-modal-backdrop" onClick={onClose}>
      <div className="add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-modal-header">
          <h2 className="add-modal-title">Add a Book</h2>
          <button className="add-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="add-modal-body">
          {/* Title */}
          <div className="field-group">
            <label className="field-label">Title <span className="required">*</span></label>
            <input
              className={`field-input ${touched.title && errors.title ? "field-error" : ""}`}
              name="title" value={fields.title}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="e.g. The Great Gatsby" maxLength={120}
            />
            {touched.title && errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          {/* Author */}
          <div className="field-group">
            <label className="field-label">Author <span className="required">*</span></label>
            <input
              className={`field-input ${touched.author && errors.author ? "field-error" : ""}`}
              name="author" value={fields.author}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="e.g. F. Scott Fitzgerald" maxLength={100}
            />
            {touched.author && errors.author && <span className="error-msg">{errors.author}</span>}
          </div>

          {/* Genre */}
          <div className="field-group">
            <label className="field-label">Genre <span className="required">*</span></label>
            <select
              className={`field-input field-select ${touched.genre && errors.genre ? "field-error" : ""}`}
              name="genre" value={fields.genre}
              onChange={handleChange} onBlur={handleBlur}
            >
              <option value="">Select a genre…</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {touched.genre && errors.genre && <span className="error-msg">{errors.genre}</span>}
          </div>

          {/* Synopsis */}
          <div className="field-group">
            <label className="field-label">Synopsis <span className="required">*</span></label>
            <textarea
              className={`field-input field-textarea ${touched.synopsis && errors.synopsis ? "field-error" : ""}`}
              name="synopsis" value={fields.synopsis}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="A short description of the book…" maxLength={600} rows={4}
            />
            <span className="char-count">{fields.synopsis.length} / 600</span>
            {touched.synopsis && errors.synopsis && <span className="error-msg">{errors.synopsis}</span>}
          </div>

          {/* Cover URL */}
          <div className="field-group">
            <label className="field-label">
              Cover Image URL <span className="optional">(optional)</span>
            </label>
            <input
              className={`field-input ${touched.coverUrl && errors.coverUrl ? "field-error" : ""}`}
              name="coverUrl" value={fields.coverUrl}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="https://example.com/book-cover.jpg"
            />
            {touched.coverUrl && errors.coverUrl
              ? <span className="error-msg">{errors.coverUrl}</span>
              : <span className="field-hint">Paste a direct link to a cover image. Leave blank to use a placeholder.</span>
            }
          </div>

          {/* Audible checkbox */}
          <div className="field-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isOnAudible"
                checked={fields.isOnAudible}
                onChange={handleChange}
                className="checkbox-input"
              />
              🎧 Available on Audible
            </label>
            <span className="field-hint">Check this if the book has an audiobook on Audible.</span>
          </div>
        </div>

        <div className="add-modal-footer">
          <button className="add-modal-btn add-modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="add-modal-btn add-modal-btn-save" onClick={handleSubmit}>Add to Library</button>
        </div>
      </div>
    </div>
  );
}

export default AddBookModal;
