import { useEffect, useState } from "react";
import bookService,{IBook} from "../Services/bookService"
import BookRow from "./BookRow";
import useAuth from "../Hooks/useAuth";

export default function AllBooks() {
  const { getBooks, cancelBooks } = bookService.getAll();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading } = useAuth();

  useEffect(() => {
    getBooks.then((res) => setBooks(res.data)).catch((err) =>
      console.log(err)
    );
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>All Books</h1>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {books.map((book) => (
          <li
            key={book._id}
            style={{
              flex: "1 1 calc(33.333% - 15px)",
              boxSizing: "border-box",
              minWidth: "10px", 
              display: "flex",
              flexDirection: "column",
            }}
          >
            <BookRow
              image={book.coverImg}
              url={`/bookReview/${book._id}`}
              title={book.title}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}