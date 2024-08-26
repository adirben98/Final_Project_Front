import { useEffect, useState } from "react";
import bookService, { IBook } from "../Services/bookService";
import useAuth from "../Hooks/useAuth";

export default function AllBooks() {
  const { getBooks, cancelBooks } = bookService.getAll();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading } = useAuth();

  useEffect(() => {
    getBooks
      .then((res) => setBooks(res.data))
      .catch((err) => console.log(err));
    setLoading(isLoading);

    return () => {
      cancelBooks();
    };
  }, [isLoading]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "space-between",
      }}
    >
      <h1 style={{ width: "100%", marginBottom: "20px", textAlign: "center" }}>All Books</h1>
      {books.map((book) => (
        <div
          key={book._id}
          style={{
            width: "200px",
            height: "300px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#fff",
            textAlign: "center",
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
          }}
        >
          <a href={`/bookReview/${book._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
              style={{
                width: "100%",
                height: "80%",
                backgroundImage: `url(${book.coverImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div style={{ padding: "10px", fontWeight: "bold" }}>{book.title}</div>
          </a>
        </div>
      ))}
    </div>
  );
}
