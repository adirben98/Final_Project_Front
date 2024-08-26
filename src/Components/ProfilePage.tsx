import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth, { CanceledError } from "../Hooks/useAuth";
import ChangePassword from "./ChangePassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import uploadPhoto from "../Services/fileService";
import { IUser } from "../Services/authService";
import avatar from "../assets/avatar.png";
import userService from "../Services/userService";
import bookService, { IBook } from "../Services/bookService";
import BookRow from "./BookRow";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("myBooks");
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<string>(avatar);
  const [user, setUser] = useState<IUser>({
    username: "",
    email: "",
    image: avatar,
    accessToken: "",
    refreshToken: "",
  });

  const [myBooks, setMyBooks] = useState<IBook[]>([]);
  const [favorites, setFavorites] = useState<IBook[]>([]);
  const [renderNeeded, setRenderNeeded] = useState<boolean>(false);
  const { name } = useParams();
  const [newImage, setNewImage] = useState<File>();
  const photoGalleryRef = useRef<HTMLInputElement>(null);
  const { isLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  async function uploadCurrentPhoto(photo: File) {
    const url = await uploadPhoto(photo);
    userService
      .updateUserImage(url)
      .then(() => {
        setRenderNeeded((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleClick() {
    photoGalleryRef.current?.click();
  }

  function logout() {
    userService.logout();
    window.location.href = "/login";
  }

  const errorHandler = (error: unknown) => {
    if (error instanceof CanceledError) return;
    window.location.href = "/404";
    console.log(error);
  };

  useEffect(() => {
    const { User, cancelUser } = userService.getUser(name!);
    const { userBooksAndFavorites, cancelUserBooksAndFavorites } =
      bookService.getUserBooksAndFavorites(name!);
    setCurrentUser(userService.getConnectedUser());

    async function fetchProfile() {
      User.then((res) => {
        setUser(res.data);
        setImage(res.data.image || avatar);
      }).catch((error) => {
        errorHandler(error);
      });

      userBooksAndFavorites
        .then((books) => {
          setMyBooks(books.data.books);
          setFavorites(books.data.favorites);
        })
        .catch((error) => {
          errorHandler(error);
        });

      setLoading(isLoading);
    }

    fetchProfile();
    return () => {
      cancelUser();
      cancelUserBooksAndFavorites();
    };
  }, [name, renderNeeded, isLoading]);

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
      className="profile-page-container"
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(to bottom, #f0f9ff, #e0f7fa)",
      }}
    >
      {/* Profile Header */}
      <div
        className="profile-header"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginRight: "30px" }}>
          <div
            style={{
              position: "relative",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "5px solid #fda085",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={newImage ? URL.createObjectURL(newImage) : image}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {currentUser?.username === user.username && (
              <button
                type="button"
                onClick={handleClick}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  background: "#fda085",
                  borderRadius: "50%",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <FontAwesomeIcon icon={faImage} style={{ color: "#fff" }} />
              </button>
            )}
            <input
              style={{ display: "none" }}
              ref={photoGalleryRef}
              type="file"
              onChange={(event) => {
                if (event.target.files) {
                  setNewImage(event.target.files[0]);
                  uploadCurrentPhoto(event.target.files[0]);
                }
              }}
            />
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: 600, margin: 0, color: "#333" }}>
            {user.username}
          </h2>
          {currentUser?.username === user.username && (
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => setActiveTab("Edit")}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  border: "1px solid #dbdbdb",
                  borderRadius: "4px",
                  backgroundColor: "#fda085",
                  color: "#fff",
                  cursor: "pointer",
                  marginRight: "10px",
                  transition: "background-color 0.3s",
                }}
              >
                Edit Profile
              </button>
              <button
                onClick={logout}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  border: "1px solid #dbdbdb",
                  borderRadius: "4px",
                  backgroundColor: "#ff6f61",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveTab("myBooks")}
          style={{
            fontSize: "16px",
            fontWeight: "500",
            padding: "10px 20px",
            cursor: "pointer",
            background: "none",
            border: "none",
            color: activeTab === "myBooks" ? "#333" : "#888",
            borderBottom:
              activeTab === "myBooks" ? "3px solid #fda085" : "none",
            transition: "color 0.3s, border-bottom 0.3s",
          }}
        >
          My Books
        </button>
        {currentUser?.username === user.username && (
          <button
            onClick={() => setActiveTab("favorites")}
            style={{
              fontSize: "16px",
              fontWeight: "500",
              padding: "10px 20px",
              cursor: "pointer",
              background: "none",
              border: "none",
              color: activeTab === "favorites" ? "#333" : "#888",
              borderBottom:
                activeTab === "favorites" ? "3px solid #fda085" : "none",
              transition: "color 0.3s, border-bottom 0.3s",
            }}
          >
            Favorites
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "myBooks" && (
          <div>
            <h3
              style={{
                color: "#555",
                fontSize: "22px",
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              My Books
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {myBooks.map((book) => (
                <BookRow
                  key={book._id}
                  image={book.coverImg}
                  title={book.title}
                  url={`/bookReview/${book._id}`}
                />
              ))}
            </div>
          </div>
        )}

       
        {activeTab === "favorites" && (
          <div>
            <h3
              style={{
                color: "#555",
                fontSize: "22px",
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              Favorite Books
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {favorites.map((book) => (
                <BookRow
                  key={book._id}
                  image={book.coverImg}
                  title={book.title}
                  url={`/books/${book._id}`}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Edit" && (
          <ChangePassword
            afterEdit={() => {
              setActiveTab("");
              setRenderNeeded((prev) => !prev);
            }}
          />
        )}
      </div>
    </div>
  );
}
