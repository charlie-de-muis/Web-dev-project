import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ReviewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleMouseEnter = (star: number) => setHoveredRating(star);
  const handleMouseLeave = () => setHoveredRating(0);
  const handleRatingClick = (star: number) => setRating(star);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You need to log in to submit a review.");
      return;
    }

    const data = { rating, feedback };

    try {
      const response = await fetch(`/api/v1/attendance/event/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("Review submitted successfully!");
        setRating(0);
        setFeedback("");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to submit the review.");
      }
    } catch (error) {
      setMessage("An error occurred while submitting the review.");
    }
  };

  // styling
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "2rem",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      fontSize: "1.8rem",
      color: "#202124",
      textAlign: "center",
      marginBottom: "1rem",
    },
    message: {
      fontSize: "1rem",
      color: message.includes("successfully") ? "green" : "red",
      textAlign: "center",
      marginTop: "1rem",
    },
    starContainer: {
      display: "flex",
      justifyContent: "center",
      margin: "1rem 0",
      cursor: "pointer",
    },
    star: {
      fontSize: "2rem",
      color: "#e4e5e9",
      transition: "color 0.2s",
    },
    starSelected: {
      color: "#ffc107",
    },
    label: {
      fontSize: "1rem",
      color: "#5f6368",
      marginBottom: "0.5rem",
      display: "block",
    },
    textarea: {
      width: "100%",
      minHeight: "100px",
      fontSize: "1rem",
      padding: "0.5rem",
      border: "1px solid #dadce0",
      borderRadius: "4px",
      marginBottom: "1rem",
      fontFamily: "inherit",
    },
    button: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#4285F4",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textAlign: "center",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#357ae8",
    },
    backButton: {
      marginTop: "1rem",
      width: "100%",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "1rem",
      color: "#4285F4",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>Rating:</label>
          <div style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => handleMouseEnter(star)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleRatingClick(star)}
                style={{
                  ...styles.star,
                  ...(star <= (hoveredRating || rating) && styles.starSelected),
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div>
          <label style={styles.label}>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            style={styles.textarea}
          />
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor!)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor!)}
        >
          Submit Review
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <a href="/user" style={styles.backButton}>
        Back
      </a>
    </div>
  );
};

export default ReviewForm;
