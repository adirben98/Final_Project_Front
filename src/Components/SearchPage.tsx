import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth, { CanceledError } from "../Hooks/useAuth";
import BookRow from "./BookRow";
import bookService, { IBook } from "../Services/bookService";
import userService from "../Services/userService";
import { IUser } from "../Services/authService";

export default function SearchPage() {
  const location = useLocation();
  const [userSearch, setUserSearch] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookResults, setBookResults] = useState<IBook[]>([]);
  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q");
  const [func, setFunc] = useState<string>(params.get("f") || "books");
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!queryParam || !func) return;
    let funcCall;

    if (func === "hero") funcCall = bookService.searchByHero(queryParam);
    else if (func === "books") funcCall = bookService.search(queryParam);
    else funcCall = userService.search(queryParam);

    const { results, cancelSearch } = funcCall;

    results
      .then((res) => {
        if (func === "hero" || func === "books") {
          setBookResults(res.data as IBook[]);
        } else {
          setUserSearch(res.data as IUser[]);
        }
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      cancelSearch();
    };
  }, [queryParam, func, isLoading]);

  const handleButtonClick = (type: string) => {
    setFunc(type);
  };

  if (loading || isLoading) {
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
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ color: "#333", marginRight: "20px" }}>
              {"Your search result for: "}
              {queryParam}
            </h2>
            <button
              onClick={() => handleButtonClick("books")}
              style={{
                padding: "10px 20px",
                marginRight: "10px",
                backgroundColor: func === "books" ? "#007bff" : "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease, transform 0.2s ease",
                transform: func === "books" ? "scale(1.05)" : "scale(1)",
                textTransform: "uppercase",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              Books
            </button>
            <button
              onClick={() => handleButtonClick("users")}
              style={{
                padding: "10px 20px",
                backgroundColor: func === "users" ? "#007bff" : "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease, transform 0.2s ease",
                transform: func === "users" ? "scale(1.05)" : "scale(1)",
                textTransform: "uppercase",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              Users
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {func === "users"
              ? userSearch.map((user) => (
                  <div
                    key={user.username}
                    style={{
                      flex: "1 1 calc(33.333% - 10px)",
                      boxSizing: "border-box",
                    }}
                  >
                    <BookRow
                      image={user.image}
                      title={user.username}
                      url={`/profile/${user.username}`}
                    />
                  </div>
                ))
              : bookResults.map((book) => (
                  <div
                    key={book._id}
                    style={{
                      flex: "1 1 calc(33.333% - 10px)",
                      boxSizing: "border-box",
                    }}
                  >
                    <BookRow
                      image={book.coverImg}
                      title={book.title}
                      description={book.description}
                      url={`/book/${book._id}`}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
