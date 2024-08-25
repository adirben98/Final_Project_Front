import { Link } from "react-router-dom";

export interface BookRowProps {
  image: string;
  title: string;
  url: string;
}

export default function BookRow({ image, title, url }: BookRowProps) {
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
        width: "calc(25% - 40px)", // 4 items per row
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.1)";
      }}
    >
      <Link to={url} style={{ width: "100%", display: "block" }}>
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "200px", // Fixed height for consistency
            objectFit: "fill", // Fill the container without distortion
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        />
      </Link>
      <div
        style={{
          padding: "15px",
          textAlign: "center",
          fontSize: "1em",
          color: "#333",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "600",
          backgroundColor: "#f4f4f4",
          borderTop: "1px solid #ddd",
        }}
      >
        <Link
          to={url}
          style={{
            textDecoration: "none",
            color: "#2C3E50",
            transition: "color 0.3s ease",
            display: "block",
            fontWeight: "700",
            whiteSpace: "normal",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {title}
        </Link>
      </div>
    </div>
  );
}
