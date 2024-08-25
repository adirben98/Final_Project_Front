import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import heroService, { IHero } from "../Services/heroService";
import useAuth from "../Hooks/useAuth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "react-feather";
import { FaBook } from "react-icons/fa";
import coverHome from "../assets/coverHome.mp4";
import { Link } from "react-router-dom";
import useOnScreen from "../Hooks/useOnScreen";
import bookService, { IBook } from "../Services/bookService";
import BookRow from "./BookRow";

const HomePage: React.FC = () => {
  const latestBooks: string[] = [
    "Latest Book 1",
    "Latest Book 2",
    "Latest Book 3",
  ];

  const [topBooks, setTopBooks] = useState<IBook[]>([]);
  const { getTopBooks, cancelGetTopBooks } = bookService.getTopBooks();

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);

  const isVisible1 = useOnScreen(ref1);
  const isVisible2 = useOnScreen(ref2);
  const isVisible3 = useOnScreen(ref3);

  const fadeInOutStyle = (isVisible: boolean): React.CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  });

  const videoContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "0",
    paddingBottom: "42.85%", 
    overflow: "hidden",
    borderRadius: "0",
    backgroundColor: "#87CEEB", 
  };

  const videoStyle: React.CSSProperties = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "auto",
    height: "100%",
    objectFit: "contain",
    filter: "brightness(90%)",
     
  };

  const contentStyle: React.CSSProperties = {
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "20px",
    backgroundColor: "#FFF8DC", 
    width: "100%",
    maxWidth: "1400px", 
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
    zIndex: 1,
    border: "2px solid #FF69B4", // Hot pink border
  };

  const openingPhraseStyle: React.CSSProperties = {
    fontSize: "2.5em", // Smaller font size
    color: "#ff4500",
    fontFamily: "'Fredoka One', cursive",
    textAlign: "center",
    margin: "20px 0",
    ...fadeInOutStyle(isVisible1),
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "1.2em", // Smaller font size
    color: "#555",
    textAlign: "center",
    margin: "20px 0",
    lineHeight: "1.6",
    backgroundColor: "#FFDEAD", // Navajo white color
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    ...fadeInOutStyle(isVisible2),
  };

  const catchphraseStyle: React.CSSProperties = {
    fontSize: "1.8em", // Smaller font size
    color: "#32cd32",
    textAlign: "center",
    margin: "20px 0",
    fontFamily: "'Fredoka One', cursive",
    ...fadeInOutStyle(isVisible3),
  };

  const subHeaderStyle: React.CSSProperties = {
    fontSize: "2em", // Smaller font size
    color: "#FF69B4",
    marginBottom: "20px",
    textAlign: "left",
  };

  const heroImageStyle: React.CSSProperties = {
    width: "auto",
    height: "200px", // Smaller height for images
    maxWidth: "100%",
    objectFit: "cover",
    margin: "0 auto",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transform: "scale(1)",
    transition: "transform 0.3s ease-in-out",
  };

  const heroNameStyle: React.CSSProperties = {
    fontSize: "1.8em", // Smaller font size
    color: "#ff4500",
    textAlign: "center",
    marginTop: "10px",
    fontFamily: "'Fredoka One', cursive",
  };

  const carouselContainerStyle: React.CSSProperties = {
    width: "100%",
    marginTop: "30px",
    position: "relative",
  };

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker background for arrows
    borderRadius: "50%",
    cursor: "pointer",
  };

  const PreviousArrow: React.FC<{ onClick?: React.MouseEventHandler }> = ({
    onClick,
  }) => (
    <div style={{ ...arrowStyle }} onClick={onClick}>
      <ChevronLeft size={40} color="white" /> {/* Smaller arrow size */}
    </div>
  );

  const NextArrow: React.FC<{ onClick?: React.MouseEventHandler }> = ({
    onClick,
  }) => (
    <div style={{ ...arrowStyle, right: "5px" }} onClick={onClick}>
      <ChevronRight size={40} color="white" /> {/* Smaller arrow size */}
    </div>
  );

  const { isLoading } = useAuth();
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const { getHeroes, cancelHeroes } = heroService.getHeroes();

  useEffect(() => {
    getHeroes.then((response) => {
      setHeroes(response.data);
    });
    getTopBooks.then((response) => {
      setTopBooks(response.data);
    });
    return () => {
      cancelHeroes();
      cancelGetTopBooks();
    };
  }, [isLoading]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", paddingTop: "0" }}>
      <div style={videoContainerStyle}>
        <video src={coverHome} autoPlay loop muted style={videoStyle} />
      </div>
      <div style={contentStyle}>
        <section ref={ref1} style={openingPhraseStyle}>
          Welcome to Bookify!
        </section>
        <section ref={ref2} style={descriptionStyle}>
          At Bookify, your imagination is the limit! Create your own magical
          adventures, choose your favorite heroes, and dive into a world full of
          fun and excitement. Whether you're making up stories about dragons,
          superheroes, or talking animals, there's no end to the fun you can
          have. Share your amazing creations with friends and let everyone see
          the stories only you can dream up!
        </section>
        <section ref={ref3} style={catchphraseStyle}>
          Start Your Adventure Now{" "}
          <FaBook style={{ marginLeft: "10px", color: "#ff4500" }} />
        </section>

        <section style={carouselContainerStyle}>
          <h2 style={subHeaderStyle}>Meet Your Heroes</h2>
          <div style={{ width: "30%", padding: "20px 0", margin: "0 auto", textAlign: "left" }}>
            <Slider {...settings}>
              {heroes.map((hero, index) => (
                <div key={index}>
                  <Link to={`/search?q=${hero.name}&f=hero`}>
                    <img
                      src={hero.image}
                      alt={hero.name}
                      style={heroImageStyle}
                    />
                  </Link>
                  <p style={heroNameStyle}>{hero.name}</p>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <section style={carouselContainerStyle}>
          <h2 style={subHeaderStyle}>Top 5 Books of the Week</h2>
          <div style={{ width: "80%", padding: "20px 0", margin: "0 auto", textAlign: "left" }}>
            <Slider {...settings}>
              {topBooks.map((book) => (
                <div key={book._id}>
                  <BookRow
                    image={book.coverImg}
                    url={`/bookReview/${book._id}`}
                    title={book.title}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <section style={{ marginBottom: "30px", width: "100%" }}>
          <h2 style={subHeaderStyle}>Latest Books Created</h2>
          <ul>
            {latestBooks.map((book, index) => (
              <li
                key={index}
                style={{
                  fontSize: "1.2em", // Smaller font size
                  color: "#32cd32",
                  marginBottom: "10px",
                  fontFamily: "'Comic Sans MS', cursive",
                }}
              >
                {book}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
