import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import heroService, { IHero } from "../Services/heroService";
import useAuth from "../Hooks/useAuth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "react-feather";
import coverHome from "../assets/coverHome.mp4";
import { Link } from "react-router-dom";
import useOnScreen from "../Hooks/useOnScreen";
import bookService, { IBook } from "../Services/bookService";

const HomePage: React.FC = () => {
  const [top10Books, setTop10Books] = useState<IBook[]>([]);
  const [randomBooks, setRandomBooks] = useState<IBook[]>([]);
  const { getBooks, cancelGetBooks } = bookService.getTopAndRandomBooks();

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
    width: "50%",
    height: "auto",
    paddingBottom: "42.85%",
    overflow: "hidden",
    borderRadius: "0",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  };

  const videoStyle: React.CSSProperties = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "auto",
    height: "100%",
    objectFit: "contain",
    filter: "brightness(90%)",
    borderRadius: "15px",
  };

  const contentContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    height: "auto",
    padding: "20px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    backgroundColor: "#FFEB3B", // Bright yellow background
    margin: "20px auto",
    maxWidth: "1400px",
  };

  const textContainerStyle: React.CSSProperties = {
    width: "50%",
    padding: "20px",
  };

  const openingPhraseStyle: React.CSSProperties = {
    fontSize: "2.5em",
    color: "#FF5722", // Bright orange text color
    fontFamily: "'Fredoka One', cursive",
    textAlign: "center",
    margin: "20px 0",
    ...fadeInOutStyle(isVisible1),
    backgroundColor: "#FCE4EC", // Light pink background
    padding: "10px",
    borderRadius: "10px",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "1.2em",
    color: "#555",
    textAlign: "center",
    margin: "20px 0",
    lineHeight: "1.6",
    backgroundColor: "#FFD54F", // Light amber background
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    ...fadeInOutStyle(isVisible2),
  };

  const catchphraseStyle: React.CSSProperties = {
    fontSize: "1.8em",
    color: "#4CAF50", // Bright green color
    textAlign: "center",
    margin: "20px 0",
    fontFamily: "'Fredoka One', cursive",
    ...fadeInOutStyle(isVisible3),
    backgroundColor: "#E0F7FA", // Light blue background
    padding: "10px",
    borderRadius: "10px",
  };

  const subHeaderStyle: React.CSSProperties = {
    fontSize: "2em",
    color: "#E91E63", // Pink color for headers
    marginBottom: "20px",
    textAlign: "center",
    fontFamily: "'Fredoka One', cursive",
  };

  const additionSubHeaderStyle: React.CSSProperties = {
    ...subHeaderStyle,
    marginTop: "90px",
  };

  const heroImageStyle: React.CSSProperties = {
    width: "auto",
    height: "200px",
    maxWidth: "100%",
    objectFit: "cover",
    margin: "0 auto",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transform: "scale(1)",
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer",
  };

  const heroNameStyle: React.CSSProperties = {
    fontSize: "1.8em",
    color: "#FF5722", // Bright orange for hero names
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "50%",
    cursor: "pointer",
  };

  const PreviousArrow: React.FC<{ onClick?: React.MouseEventHandler }> = ({
    onClick,
  }) => (
    <div style={{ ...arrowStyle }} onClick={onClick}>
      <ChevronLeft size={40} color="white" />
    </div>
  );

  const NextArrow: React.FC<{ onClick?: React.MouseEventHandler }> = ({
    onClick,
  }) => (
    <div style={{ ...arrowStyle, right: "5px" }} onClick={onClick}>
      <ChevronRight size={40} color="white" />
    </div>
  );

  const { isLoading } = useAuth();
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const { getHeroes, cancelHeroes } = heroService.getHeroes();

  useEffect(() => {
    getHeroes.then((response) => {
      setHeroes(response.data);
    });
    getBooks.then((response) => {
      const books = response.data;
      setTop10Books(books.topTenBooks);
      setRandomBooks(books.randomBooks);
    });

    return () => {
      cancelHeroes();
      cancelGetBooks();
    };
  }, [isLoading]);

  const bookGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    width: "90%",
    margin: "0 auto",
    padding: "20px 0",
  };

  const bookCardStyle: React.CSSProperties = {
    padding: "10px",
    textAlign: "center",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#FFEB3B", // Bright yellow background for book cards
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "0",
        backgroundColor: "#FFCCBC", // Light peach background for entire page
        minHeight: "100vh",
      }}
    >
      <div style={contentContainerStyle}>
        <div style={textContainerStyle}>
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
            Discover, Create, and Share your very own storybook!
          </section>
        </div>
        <div style={videoContainerStyle}>
          <video autoPlay loop muted style={videoStyle}>
            <source src={coverHome} type="video/mp4" />
          </video>
        </div>
      </div>

      <h2 style={subHeaderStyle}>Meet Our Heroes</h2>
      <div style={carouselContainerStyle}>
        <Slider
          infinite
          speed={500}
          slidesToShow={5}
          slidesToScroll={1}
          prevArrow={<PreviousArrow />}
          nextArrow={<NextArrow />}
        >
          {heroes.map((hero) => (
            <div key={hero.name}>
              <Link to={`/search?q=${hero.name}&f=hero`}>
                <img
                  src={hero.image}
                  alt={hero.name}
                  style={heroImageStyle}
                />
                <div style={heroNameStyle}>{hero.name}</div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      <h2 style={additionSubHeaderStyle}>Top 10 Books</h2>
      <div style={bookGridStyle}>
        {top10Books.map((book) => (
          <div key={book._id} style={bookCardStyle}>
            <Link to={`/bookReview/${book._id}`}>
              <img
                src={book.coverImg}
                alt={book.title}
                style={heroImageStyle}
              />
              <h3>{book.title}</h3>
            </Link>
          </div>
        ))}
      </div>

      <h2 style={additionSubHeaderStyle}>Random Books</h2>
      <div style={bookGridStyle}>
        {randomBooks.map((book) => (
          <div key={book._id} style={bookCardStyle}>
            <Link to={`/bookReview/${book._id}`}>
              <img
                src={book.coverImg}
                alt={book.title}
                style={heroImageStyle}
              />
              <h3>{book.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;