import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import heroService, { IHero } from "../Services/heroService";
import useAuth from "../Hooks/useAuth";
import bookService from "../Services/bookService";

interface CustomArrowProps {
  className: string;
  style: React.CSSProperties;
  onClick: () => void;
  direction: "left" | "right";
}

const CustomArrow: React.FC<CustomArrowProps> = ({
  className,
  style,
  onClick,
  direction,
}) => (
  <button
    className={className}
    style={{
      ...style,
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: "50%",
      cursor: "pointer",
      width: "45px",
      height: "45px",
      border: "none",
      [direction]: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={onClick}
  >
    {direction === "left" ? "←" : "→"}
  </button>
);

const CreateStory: React.FC = () => {
  const [selectedHero, setSelectedHero] = useState<number | null>(null);
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const [step, setStep] = useState<number>(1);
  const { getHeroes, cancelHeroes } = heroService.getHeroes();
  const { isLoading } = useAuth();
  const [hero, setHero] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState<string>("");
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>("");

  useEffect(() => {
    getHeroes
      .then((response) => setHeroes(response.data))
      .catch((error) => console.error("Error fetching heroes:", error));

    return () => cancelHeroes();
  }, [isLoading, getHeroes, cancelHeroes]);

  const handleHeroClick = (heroName: string, index: number) => {
    if (selectedHero === index) {
      setHero(null);
      setSelectedHero(null);
    } else {
      setHero(heroName);
      setSelectedHero(index);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const generateStory = async () => {
    if (!hero || !prompt) return;
    setIsLoading(true);
    bookService
      .generateBook(hero!, prompt!)
      .then((res) => {
        if (res.status !== 200) {
          modalRef.current?.showModal();
          console.log("Error generating book:", res.status);
          console.error("Error generating book:", res);
        } else {
          console.log(res.data);
          window.location.href = `/book/${res.data}`;
        }
      })
      .catch((error) => {
        setText(
          "It seems that your prompt might have been violating our content policy!\n Please try again with another prompt."
        );
        modalRef.current?.showModal();
        console.error("Error generating book:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateStoryClick = () => {
    if (!prompt) {
      setWarningMessage(
        "Please enter your book idea before creating the story."
      );
    } else {
      setWarningMessage(""); // Clear the warning message if prompt is provided
      setIsConfirmationDialogOpen(true); // Open the confirmation dialog
    }
  };

  const handleDialogClose = () => {
    setIsConfirmationDialogOpen(false); // Close the confirmation dialog
  };

  const handleConfirmCreateStory = () => {
    setIsConfirmationDialogOpen(false);
    generateStory(); // Call the function to generate the story
  };
  const loaderContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center the loader and text horizontally
  };

  const loaderOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const loaderStyle: React.CSSProperties = {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #3498db",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 1s linear infinite",
  };
  const loaderTextStyle: React.CSSProperties = {
    marginTop: "20px",
    color: "#fff",
    fontSize: "16px",
    textAlign: "center",
  };
  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const carouselContainerStyle: React.CSSProperties = {
    width: "40%",
    marginTop: "40px",
    margin: "0 auto",
  };

  const heroContainerStyle: React.CSSProperties = {
    width: "auto",
    maxWidth: "100%",
    objectFit: "cover",
    margin: "0 auto",
    padding: "10px",
    outline: "none",
    boxShadow: "none",
  };

  const heroImageStyle = (isSelected: boolean): React.CSSProperties => ({
    width: "auto",
    height: "300px",
    maxWidth: "100%",
    objectFit: "cover",
    margin: "0 auto",
    padding: "10px",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    transform: isSelected ? "scale(1.07)" : "scale(0.8)",
    outline: "2px solid white",
  });

  const heroNameStyle: React.CSSProperties = {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "1.5em",
    color: "#333",
    fontFamily: "'Lobster', cursive",
  };

  const ButtonStyle: React.CSSProperties = {
    display: selectedHero !== null ? "block" : "none",
    margin: "-50px auto",
    marginLeft: "700px",
    width: "60px",
    height: "60px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "lightblue",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    textAlign: "center",
    lineHeight: "60px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    outline: "none",
  };

  const handleNextButtonMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.style.backgroundColor = "#add8e6";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
  };

  const handleNextButtonMouseLeave = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.style.backgroundColor = "lightblue";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
  };

  const settings = {
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    nextArrow: (
      <CustomArrow
        direction="right"
        className={""}
        style={{}}
        onClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    ),
    prevArrow: (
      <CustomArrow
        direction="left"
        className={""}
        style={{}}
        onClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    ),
    adaptiveHeight: true,
  };

  return (
    <div>
      <dialog
        data-modal
        ref={modalRef}
        style={{
          width: "300px",
          padding: "20px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <p
          style={{
            marginBottom: "15px",
            color: "#333",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.5",
          }}
        >
          {text}
        </p>
        <button
          className="close-button"
          onClick={() => modalRef.current?.close()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          Close
        </button>
      </dialog>

      {isConfirmationDialogOpen && (
        <dialog
          open
          style={{
            width: "300px",
            padding: "20px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1001,
          }}
        >
          <p
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              color: "#333",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Are you ready to create your original story?
          </p>
          <div>
            <button
              onClick={handleConfirmCreateStory}
              style={{
                padding: "10px 20px",
                marginRight: "10px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Yes, create me
            </button>
            <button
              onClick={handleDialogClose}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Not yet
            </button>
          </div>
        </dialog>
      )}

      <style>{spinKeyframes}</style>
      <section style={carouselContainerStyle}>
        {step === 1 && (
          <>
            <h2
              style={{
                textAlign: "center",
                fontSize: "42px",
                marginBottom: "50px",
                color: "#333",
                letterSpacing: "1px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Choose Your Heroes
            </h2>
            <div style={{ width: "600px", margin: "0 auto" }}>
              {heroes.length > 0 ? (
                <Slider {...settings}>
                  {heroes.map((hero, index) => (
                    <div
                      key={hero.name}
                      style={heroContainerStyle}
                      onClick={() => handleHeroClick(hero.name, index)}
                    >
                      <img
                        src={hero.image}
                        alt={hero.name}
                        style={heroImageStyle(selectedHero === index)}
                      />
                      <p style={heroNameStyle}>{hero.name}</p>
                    </div>
                  ))}
                </Slider>
              ) : (
                <p style={{ fontSize: "18px", color: "#777" }}>
                  Loading heroes...
                </p>
              )}
            </div>
            <button
              style={ButtonStyle}
              onClick={handleNextStep}
              onMouseEnter={handleNextButtonMouseEnter}
              onMouseLeave={handleNextButtonMouseLeave}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2
              style={{
                fontSize: "36px",
                color: "#333",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Your Story
            </h2>
            <textarea
              onBlur={(e) => setPrompt(e.target.value)}
              placeholder="Write your story here..."
              style={{
                width: "60%",
                height: "200px",
                padding: "15px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
                resize: "none",
              }}
            />
            {warningMessage && (
              <p style={{ color: "red", marginBottom: "70px" }}>
                {warningMessage}
              </p>
            )}
            {loading && (
              <div style={loaderOverlayStyle}>
                <div style={loaderContainerStyle}>
                  <div style={loaderStyle}></div>
                  <p style={loaderTextStyle}>
                    Generating the story might take up to 2 minutes...
                  </p>
                </div>
              </div>
            )}

            <button
              style={{
                ...ButtonStyle,
                backgroundColor: "lightblue",
                marginLeft: "390px",
              }}
              onMouseEnter={handleNextButtonMouseEnter}
              onMouseLeave={handleNextButtonMouseLeave}
              onClick={handleCreateStoryClick} // Check and open the confirmation dialog
            >
              Create Story
            </button>

            <button
              style={{
                display: selectedHero !== null ? "block" : "none",
                width: "60px",
                marginLeft: "20px",
                height: "60px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#fff",
                backgroundColor: "lightblue",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                textAlign: "center",
                lineHeight: "60px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                outline: "none",
                marginTop: "-60px",
              }}
              onMouseEnter={handleNextButtonMouseEnter}
              onMouseLeave={handleNextButtonMouseLeave}
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default CreateStory;
