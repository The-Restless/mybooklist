import { useState } from "react";
import { top20Books } from "../../data/top20books";
import BookLogo from "../../assets/book-icon.svg";
import "./home.css";

function Home() {
  const [view, setView] = useState("library");
  const [myLibrary, setMyLibrary] = useState([]);

  return (
    <div className="main">
      <header className="header">
        <div className="logo-container">
          <img src={BookLogo} alt="Logo" className="nav-icon" />
          <span className="main-logo">MyBookList</span>
        </div>
      </header>

      <div className="main-content">
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

        <div className="content-area">
          {view === "library" ? (
            <div className="grid-container">
              {myLibrary.length > 0 ? (
                myLibrary.map((book) => (
                  <div
                    key={book.id}
                    className="book-card"
                    data-title={book.title}
                  >
                    <div className="book-placeholder">
                      <span>{book.title}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-msg">
                  Your library is empty. Add some books!
                </p>
              )}
            </div>
          ) : (
            <div className="grid-container">
              {top20Books.map((book) => (
                <div
                  key={book.isbn}
                  className="book-card"
                  data-title={book.title}
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="book-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
