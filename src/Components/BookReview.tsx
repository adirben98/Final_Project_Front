import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth, { CanceledError } from "../Hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faBook, faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import Comment, { IComment } from "./Comment";
import CommentCreate from "./CommentCreation";
import userService from "../Services/userService";
import bookService, { IBook } from "../Services/bookService";
import commentService from "../Services/commentService";

export default function BookReview() {
  const googleFontUrl =
    "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";
  const { id } = useParams();
  const [book, setBook] = useState<IBook>(null!);
  const [loading, setLoading] = useState<boolean>(true);
  const [like, setLike] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [renderNeeded, setRenderNeeded] = useState<boolean>(false);
  const [istheAuthor, setIsTheAuthor] = useState<boolean>(false);

  const { isLoading } = useAuth();

  function deleteBook() {
    bookService
      .deleteBook(id!)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function enterBook() {
  function enterBook() {
    window.location.href = `/book/${id}`;
  }

  useEffect(() => {
    const link = document.createElement("link");
    link.href = googleFontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const { getBook, cancelBook } = bookService.getBook(id!);
    const { isLiked, cancelIsLiked } = bookService.isLiked(id!);
    const { comments, cancelComments } = commentService.getComments(id!);

    function errorHandler(error: unknown) {
      if (error instanceof CanceledError) return;
      window.location.href = "/404";
      console.log(error);
    }
    const user = userService.getConnectedUser()!;

    getBook
      .then((book) => {
        setBook(book.data);
        if (user.username === book.data.author) {
          setIsTheAuthor(true);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });

    comments
      .then((comments) => setComments(comments.data))
      .catch((error) => {
        errorHandler(error);
      });

    isLiked
      .then((isLike) => setLike(isLike.data))
      .catch((error) => {
        errorHandler(error);
      });

    setLoading(isLoading);
    function cancel() {
      cancelBook();
      cancelComments();
      cancelIsLiked();
    }

    return () => cancel();
  }, [id, isLoading, renderNeeded]);

  async function likeClick() {
    let isAuthor = false;
    if (userService.getConnectedUser()!.username === book.author)
      isAuthor = true;
    if (!like) {
      bookService
        .like(id!, isAuthor)
        .like(id!, isAuthor)
        .then(() => {
          setBook((prevBook) => ({
            ...prevBook,
            likes: prevBook.likes + 1,
          }));
          setLike(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      bookService
        .unlike(id!, isAuthor)
        .unlike(id!, isAuthor)
        .then(() => {
          setBook((prevBook) => ({
            ...prevBook,
            likes: prevBook.likes - 1,
          }));
          setLike(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f8ff",
        }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ width: "3rem", height: "3rem", borderColor: "#ff69b4" }}
        ></div>
      </div>
    );
  }
  if (!book) return;
  if (!book) return;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Open Sans', sans-serif",
        backgroundColor: "#f0f8ff",
        padding: "20px",
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "300px",
          width: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          marginBottom: "20px",
          backgroundColor: "#fff",
        }}
      >
        <img
          src={book.coverImg}
          style={{
            width: "auto",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
          }}
          alt="Book Cover"
        />
      </div>
      <div>
        <h2 style={{ fontWeight: "bolder", margin: "10px 0" }}>{book.title}</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          {istheAuthor && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                deleteBook();
              }}
              style={{ marginRight: "10px" }}
            >
              <FontAwesomeIcon icon={faTrash} className="fa-xl tinted-icon" />
            </button>
          )}

          <button
            type="button"
            className="btn"
            onClick={() => {
              enterBook();
            }}
            style={{ marginRight: "10px" }}
          >
            <FontAwesomeIcon icon={faBook} className="fa-xl tinted-icon" />
          </button>
        </div>
      </div>
      <p style={{ margin: "10px 0", textAlign: "center" }}>
        {book.description}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start", 
          width: "100%",
          maxWidth: "800px",
          margin: "20px 0",
          fontSize: "1.1rem",
          color: "#555",
        }}
      >
    
        <div style={{ display: "flex", alignItems: "center", marginRight: "30px" }}>
          <img
            src={book.authorImg}
            style={{
              borderRadius: "50%",
              width: "50px",  
              height: "50px", 
              cursor: "pointer",
              border: "2px solid #ff69b4",
              marginRight: "15px",
            }}
            alt="Author"
            onClick={() => (window.location.href = `/profile/${book.author}`)}
          />
          <div>
            <h3 style={{ margin: "0", fontSize: "1rem", color: "#333" }}> {/* **Changed to 1rem for smaller text** */}
              {book.author}
            </h3>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h5 style={{ fontSize: "12px", fontWeight: "600", margin: 0 }}> {/* **Changed to 12px for smaller text** */}
                Created At:
              </h5>
              <p
                style={{
                  fontSize: "12px",  // **Changed to 12px for smaller text**
                  margin: "0 0 0 10px",
                  color: "#333",
                }}
              >
                {book.createdAt}
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {
            <button
              type="button"
              className="btn"
              onClick={likeClick}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faThumbsUp}
                className={`fa-xl tinted-icon ${like ? "liked" : ""}`}
                style={{ color: like ? "green" : "inherit" }}
              />
            </button>
          }
          <span style={{ padding: "25px 20px" }}>Likes: {book.likes}</span>
        </div>
      </div>

      <h2 style={{ marginTop: "50px", textAlign: "center", fontSize: "1.8rem", color: "#ff6347" }}>
        Comments
      </h2>
      <CommentCreate
        author={userService.getConnectedUser()!.username!}
        bookId={`${id}`}
        handle={() => setRenderNeeded(!renderNeeded)}
      />
      <div style={{ width: "100%", maxWidth: "800px", marginTop: "20px" }}>
        {comments.map((comment, index) => (
          <Comment
            key={index}
            _id={comment._id}
            author={comment.author}
            content={comment.content}
            bookId={comment.bookId}
            createdAt={comment.createdAt}
            edited={comment.edited}
            onUpdateHandler={() => setRenderNeeded(!renderNeeded)}
          />
        ))}
      </div>
    </div>
  );
}
