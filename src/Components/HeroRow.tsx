import { Link } from "react-router-dom";
import { IHero } from "../Services/heroService";

export default function HeroRow({ name, image }: IHero) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        width: "calc(33% - 40px)", // Adjust width for multiple columns
      }}
    >
      <Link
        to={`/search?q=${name}&f=hero`}
        style={{ width: "100%", display: "block" }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "200px", // Adjust height for better fit
            objectFit: "cover",
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        />
      </Link>
      <div
        style={{
          padding: "15px",
          textAlign: "center",
          fontSize: "1.2em",
          color: "#333",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "600",
          backgroundColor: "#f4f4f4",
          borderTop: "1px solid #ddd",
        }}
      >
        <Link
          to={`/search?q=${name}&f=hero`}
          style={{
            textDecoration: "none",
            color: "#2C3E50",
            transition: "color 0.3s ease",
            display: "block",
            fontWeight: "700",
          }}
        >
          {name}
        </Link>
      </div>
    </div>
  );
}
