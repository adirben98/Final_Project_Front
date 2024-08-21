import  { useEffect, useState, CSSProperties } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import useAuth from "../Hooks/useAuth";
import bookifyLogo from "../assets/bookifyLogo.png"; 
import avatar from "../assets/avatar.png"; 
import userService from "../Services/userService";
import heroService, { IHero } from "../Services/heroService";

export default function Header() {
  const { isLoading } = useAuth();
  const [image, setImage] = useState<string>(avatar);
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    const userImg = userService.getConnectedUser()?.image || "";
    if (userImg !== "") setImage(userImg);
    console.log(userImg);
    heroService.getHeroes().getHeroes
      .then((res) => {
        setHeroes(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      heroService.getHeroes().cancelHeroes();
    };
  }, [isLoading]);

  const linkStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "#3e3e3e",
    fontFamily: "'Fredoka One', cursive",
    textDecoration: "none",
    transition: "color 0.3s ease-in-out",
  };

  const iconStyle: CSSProperties = {
    marginRight: "5px",
    fontSize: "1rem", // Smaller font size for the symbols
    transition: "transform 0.3s ease-in-out",
  };

  const hoverStyle: CSSProperties = {
    color: "#FF6347",
  };

  const hoverIconStyle: CSSProperties = {
    transform: "translateY(-2px)",
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top"
      style={{
        fontSize: "1.5rem",
        padding: "10px 30px",
        height: "80px",
        zIndex: 1000,
        backgroundColor: "#fdfdfd", // Light background color
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
      }}
    >
      <div className="container-fluid" style={{ width: "100%", padding: "0" }}>
        <Link className="navbar-brand" to="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src={bookifyLogo}
            style={{
              width: "60px",
              height: "60px",
              marginRight: "10px",
            }}
            alt="Bookify"
          />
          <span style={{
            fontSize: "1.5rem",
            fontFamily: "'Fredoka One', cursive",
            color: "#3e3e3e"
          }}>Bookify</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            borderColor: "#FF6347", // Match the theme color
            color: "#FF6347", // Toggler icon color
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarTogglerDemo01"
        >
          <ul className="navbar-nav mt-2 mt-lg-0" style={{ gap: "1.5rem" }}>
            <li className="nav-item active">
              <Link
                className="nav-link"
                to="/"
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverStyle.color!;
                  (e.currentTarget.querySelector('span') as HTMLElement).style.transform = hoverIconStyle.transform!;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = linkStyle.color as string;
                  (e.currentTarget.querySelector('span') as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <span role="img" aria-label="home" style={iconStyle}>🏠</span> Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
              style={{ position: "relative" }}
            >
              <Link
                className="nav-link dropdown-toggle"
                to="/heroes"
                id="navbarDropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverStyle.color!;
                  (e.currentTarget.querySelector('span') as HTMLElement).style.transform = hoverIconStyle.transform!;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = linkStyle.color as string;
                  (e.currentTarget.querySelector('span') as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <span role="img" aria-label="hero" style={iconStyle}>🦸‍♂️</span> Heroes
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdown"
                style={{
                  display: dropdownVisible ? "block" : "none",
                  position: "absolute",
                  backgroundColor: "#ffffff", // White background
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
                  zIndex: 1000,
                  borderRadius: "5px", // Rounded corners for dropdown
                  padding: "10px",
                }}
              >
                {heroes.map((hero) => (
                  <Link
                    key={hero.name}
                    className="dropdown-item"
                    to={`/search?q=${hero.name}&f=hero`}
                    style={{
                      fontSize: "1rem",
                      color: "#3e3e3e", // Darker text color
                      fontFamily: "'Comic Sans MS', cursive",
                      padding: "5px 10px", // Padding for dropdown items
                    }}
                  >
                    {hero.name}
                  </Link>
                ))}
              </div>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/books"
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverStyle.color!;
                  (e.currentTarget.querySelector('span') as HTMLElement).style.transform = hoverIconStyle.transform!;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = linkStyle.color as string;
                  (e.currentTarget.querySelector('span') as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <span role="img" aria-label="book" style={iconStyle}>📚</span> Books
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/create"
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverStyle.color!;
                  (e.currentTarget.querySelector('span') as HTMLElement).style.transform = hoverIconStyle.transform!;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = linkStyle.color as string;
                  (e.currentTarget.querySelector('span') as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <span role="img" aria-label="pen" style={iconStyle}>✍️</span> Create Book
              </Link>
            </li>
            <li
              className="nav-item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <SearchBar />
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/profile/${userService.getConnectedUser()?.username}`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={image}
                  className="img-fluid avatar-xxl rounded-circle"
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "2px solid #FF6347", // Add a border to match the theme
                  }}
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
