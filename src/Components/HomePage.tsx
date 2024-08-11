import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import whatsApp from "../assets/WhatsApp Image 2024-07-27 at 14.14.49_c9f501b2.jpg";
import heroService, { IHero } from "../Services/heroService";
import useAuth from "../Services/useAuth";
import { ChevronLeft, ChevronRight } from "react-feather";

const HomePage: React.FC = () => {
  const topBooks: string[] = ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"];
  const latestBooks: string[] = [
    "Latest Book 1",
    "Latest Book 2",
    "Latest Book 3",
  ];

  const subHeaderStyle: React.CSSProperties = {
    fontSize: "1.8em",
    color: "#4682B4",
    marginBottom: "10px",
    textShadow: "1px 1px #87CEEB",
  };

  const imageStyle: React.CSSProperties = {
    width: "80%",
    height: "70%",
    objectFit: "cover",
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const { isLoading } = useAuth();
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const { getHeroes, cancelHeroes } = heroService.getHeroes();
  useEffect(() => {
    getHeroes.then((response) => {
      console.log(response.data);
      setHeroes(response.data);
    });

    return () => {
      cancelHeroes();
    };
  }, [isLoading]);

  return (
    <div className="background">
      <div style={contentStyle}>
        <img src={whatsApp} alt="Top Banner" style={imageStyle} />

        <section style={{ marginBottom: "40px", width: "100%" }}>
          <h2 style={subHeaderStyle}>Top 5 Books of the Week</h2>
          <ul>
            {topBooks.map((book, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {book}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: "40px", width: "100%" }}>
          <h2 style={subHeaderStyle}>Latest Books Created</h2>
          <ul>
            {latestBooks.map((book, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {book}
              </li>
            ))}
          </ul>
        </section>

        <section>
      <h2>Meet Your Heroes</h2>
      <div className = "max-w-lg">
        <div className="overflow-hidden relative">
          <div className="flex">{heroes.map((hero) => <img src={hero.image}/>)}</div>
          <div className="absolute inset-0 flex items-center justify-between p-4">
          <button>
            <ChevronLeft size = {40}/>
          </button>
          <button>
            <ChevronRight size = {40}/>
          </button>
          </div>   
      </div>
      </div>
    </section>
      </div>
    </div>
  );
};

export default HomePage;
