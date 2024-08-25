import { useEffect, useState } from "react";
import bookService, { IBook } from "../Services/bookService";
import BookRow from "./BookRow";
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
        gap: "20px", // Adjust gap to align with the `HeroRow` component
        justifyContent: "space-between",
      }}
    >
      <h1 style={{ width: "100%", marginBottom: "20px" }}>All Books</h1>
      {books.map((book) => (
        <BookRow
          key={book._id}
          image={book.coverImg}
          url={`/bookReview/${book._id}`}
          title={book.title}
        />
      ))}
    </div>
  );
}
