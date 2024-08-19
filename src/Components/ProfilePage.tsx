import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth, { CanceledError } from "../Services/useAuth";
import BookRow from './BookRow'
import ChangePassword from "./ChangePassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import uploadPhoto from "../Services/fileService";
import { IUser } from "../Services/authService";
import avatar from "../assets/avatar.png";
import userService from "../Services/userService";
import bookService,{IBook} from "../Services/bookService";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("myRecipes");
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
      .then((res) => {
        console.log(res);
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
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        className="profile-container"
        style={{ width: "100%", maxWidth: "1000px" }}
      >
        <div className="card">
          {currentUser?.username === user.username && (
            <div className="d-flex justify-content-end">
              <span
                className="text-primary cursor-pointer"
                onClick={() => logout()}
                style={{ cursor: "pointer", padding: "10px" }}
              >
                Logout
              </span>
              <span
                className="text-primary cursor-pointer"
                onClick={() => setActiveTab("Edit")}
                style={{ cursor: "pointer", padding: "10px" }}
              >
                Edit
              </span>
            </div>
          )}
  
          <div className="card-body pb-0">
            <div className="row align-items-center">
              <div className="col-md-3">
                <div
                  className="text-center border-end"
                  style={{ padding: "20px", position: "relative" }}
                >
                  <img
                    src={newImage ? URL.createObjectURL(newImage) : image}
                    className="img-fluid avatar-xxl rounded-circle"
                    alt="Profile"
                    style={{ width: "120px", height: "120px" }}
                  />
                  {currentUser?.username === user.username && (
                    <button
                      type="button"
                      className="btn"
                      onClick={handleClick}
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "30px",
                        background: "rgb(0, 150, 255)",
                        borderRadius: "50%",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesomeIcon icon={faImage} className="fa-xl" />
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
              <div className="col-md-9">
                <div className="ms-3">
                  <div className="row my-4 align-items-center">
                    <div className="col-md-10 d-flex align-items-center">
                      <div>
                        <h4
                          className="text-primary font-size-20 mb-0 me-3"
                          style={{ padding: "6px" }}
                        >
                          {user.username}
                        </h4>
                        
                        
                      </div>
                    </div>
                  </div>
  
                  <ul
                    className="nav nav-tabs nav-tabs-custom border-bottom-0 mt-3 nav-justified"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link px-4 ${
                          activeTab === "myRecipes" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("myRecipes")}
                        role="tab"
                        tabIndex={-1}
                      >
                        <span className="d-block d-sm-none">
                          <i className="mdi mdi-menu-open"></i>
                        </span>
                        <span className="d-none d-sm-block">Books</span>
                      </button>
                    </li>
                    {currentUser?.username === user.username && (
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link px-4 ${
                            activeTab === "foodNow" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("foodNow")}
                          role="tab"
                          tabIndex={-1}
                        >
                          <span className="d-block d-sm-none">
                            <i className="fas fa-home"></i>
                          </span>
                          <span className="d-none d-sm-block">Favorites</span>
                        </button>
                      </li>
                    )}
                    
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div
        className="tab-content-container"
        style={{ width: "100%", maxWidth: "1000px", marginTop: "20px" }}
      >
        <div className="tab-content mt-4">
          {activeTab === "myRecipes" && (
            <div className="tab-pane fade show active">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {myBooks.map((book) => (
                  <div
                    key={book._id}
                    style={{ flex: "1 1 calc(33.333% - 10px)" }}
                  >
                    <BookRow
                      url={`/bookReview/${book._id!}`}
                      image={book.coverImg}
                      title={book.title}
                      description={book.description}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {activeTab === "foodNow" && (
            <div className="tab-pane fade show active">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {favorites.map((book) => (
                  <div
                    key={book._id}
                    style={{ flex: "1 1 calc(33.333% - 10px)" }}
                  >
                    <BookRow
                      url={`/bookReview/${book._id!}`}
                      image={book.coverImg}
                      title={book.title}
                      description={book.description}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
  
          {activeTab === "Edit" && (
            <div className="tab-pane fade show active">
              <ChangePassword
                afterEdit={() => {
                  setActiveTab("");
                  setRenderNeeded((prev) => !prev);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}