import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import useAuth from "../Services/useAuth";
import bookifyLogo from "../assets/bookifyLogo.png";
import avatar from "../assets/avatar.png";
import userService from "../Services/userService";
import heroService, { IHero } from "../Services/heroService";

export default function Header() {
  const { isLoading } = useAuth();
  const [image, setImage] = useState<string>(avatar);
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const { getHeroes, cancelHeroes } = heroService.getHeroes();

  useEffect(() => {
    const userImg = userService.getConnectedUser()!.image;
    if (userImg !== "") setImage(userImg);
    console.log(userService.getConnectedUser()!.image);
    getHeroes
      .then((res) => {
        setHeroes(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      cancelHeroes();
    };
  }, [isLoading]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
      style={{
        fontSize: "1.5rem",
        padding: "1rem 2.5rem",
        height: "100px", // Ensure this matches padding-top in HeaderLayout
        zIndex: 1000, // Keep the header above other content
      }}
    >
      <div className="container-fluid" style={{ width: "100%", padding: "0" }}>
        <a className="navbar-brand" href="/" style={{ padding: "0" }}>
          <img
            src={bookifyLogo}
            style={{ width: "100px", height: "100px" }} // Keep this consistent with the header height
            alt="Bookify"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarTogglerDemo01"
        >
          <ul className="navbar-nav mt-2 mt-lg-0" style={{ gap: "2rem" }}>
            <li className="nav-item active">
              <a className="nav-link" href="/" style={{ fontSize: "1.5rem" }}>
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
              style={{ position: "relative" }}
            >
              <a
                className="nav-link dropdown-toggle"
                href="/heroes"
                id="navbarDropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ fontSize: "1.5rem" }}
              >
                Heroes
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdown"
                style={{
                  display: dropdownVisible ? "block" : "none",
                  position: "absolute",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                  zIndex: 1000,
                }}
              >
                {heroes.map((hero) => (
                  <a
                  key={hero.name}
                  className="dropdown-item"
                  href={`/search?q=${hero.name}&f=hero`}
                >
                  {hero.name}
                </a>))}
              </div>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/books"
                style={{ fontSize: "1.5rem" }}
              >
                Books
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/addRecipe"
                style={{ fontSize: "1.5rem" }}
              >
                Create Book
              </a>
            </li>
            <li
              className="nav-item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <SearchBar />
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href={`/profile/${userService.getConnectedUser()!.username}`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={image}
                  className="img-fluid avatar-xxl rounded-circle"
                  alt="Profile"
                  style={{ width: "40px", height: "40px" }}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}