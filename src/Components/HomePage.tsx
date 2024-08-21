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
import homePageVid from "../assets/homePageVid.mp4";
import { Link } from "react-router-dom";
import useOnScreen from "../Hooks/useOnScreen";

const HomePage: React.FC = () => {
  const topBooks: string[] = ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"];
  const latestBooks: string[] = [
    "Latest Book 1",
    "Latest Book 2",
    "Latest Book 3",
  ];

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
    height: "60vh",
    overflow: "hidden",
    borderRadius: "15px",
    backgroundColor: "#87CEEB", // Light blue sky background color
  };

  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "60vh",
    objectFit: "cover",
    position: "absolute",
    filter: "brightness(90%)", // Slightly darker video for better text contrast
  };

  const overlayTextStyle: React.CSSProperties = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#FFD700", // Gold color
    fontSize: "3em", // Smaller font size
    fontFamily: "'Fredoka One', cursive",
    textShadow: "3px 3px 6px rgba(0, 0, 0, 0.7)",
    zIndex: 2,
  };

  const contentStyle: React.CSSProperties = {
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "20px",
    backgroundColor: "#FFF8DC", // Cornsilk color
    width: "100%",
    maxWidth: "1400px", // Increase max-width to reduce white spaces
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
    return () => {
      cancelHeroes();
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
        <video src={homePageVid} autoPlay loop muted style={videoStyle} />
        <div style={overlayTextStyle}>Welcome to Bookify!</div>
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
        <section style={{ marginBottom: "30px", width: "100%" }}>
          <h2 style={subHeaderStyle}>Top 5 Books of the Week</h2>
          <ul>
            {topBooks.map((book, index) => (
              <li
                key={index}
                style={{
                  fontSize: "1.2em", // Smaller font size
                  color: "#ff69b4",
                  marginBottom: "10px",
                  fontFamily: "'Comic Sans MS', cursive",
                }}
              >
                {book}
              </li>
            ))}
          </ul>
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
      </div>
    </div>
  );
};

export default HomePage;
