import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './background.css'; // Background CSS imported here

const HomePage: React.FC = () => {
  const topBooks: string[] = ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"];
  const latestBooks: string[] = ["Latest Book 1", "Latest Book 2", "Latest Book 3"];
  const heroes: string[] = ["Superman", "Spider-Man", "SpongeBob", "Thor", "Batman"];

  const subHeaderStyle: React.CSSProperties = {
    fontSize: '1.8em',
    color: '#4682B4',
    marginBottom: '10px',
    textShadow: '1px 1px #87CEEB'
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '600px',
    objectFit: 'cover',
  };

  // Added maxWidth to contentStyle to allow background to be visible on sides
  const contentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '1200px', // Limit the width of the content to show background on sides
    margin: '0 20px', // Add side margins for centering
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <div className="background"> {/* Use the background class from background.css */}
      <div style={contentStyle}>
        <section style={{ marginBottom: '40px', width: '100%' }}>
          <h2 style={subHeaderStyle}>Top 5 Books of the Week</h2>
          <ul>
            {topBooks.map((book, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>{book}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '40px', width: '100%' }}>
          <h2 style={subHeaderStyle}>Latest Books Created</h2>
          <ul>
            {latestBooks.map((book, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>{book}</li>
            ))}
          </ul>
        </section>

        <section style={{ width: '100%' }}>
          <h2 style={subHeaderStyle}>Meet Your Heroes</h2>
          <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-inner">
              {heroes.map((hero, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                  <img
                    src={`/${hero.toLowerCase()}.jpg`}
                    className="d-block w-100"
                    alt={hero}
                    style={imageStyle}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>{hero}</h5>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
