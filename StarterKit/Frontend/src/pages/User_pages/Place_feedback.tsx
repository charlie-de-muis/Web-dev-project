import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ReviewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the 'id' parameter from the URL
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleMouseEnter = (star: number) => {
    setHoveredRating(star);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleRatingClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You need to log in to submit a review.");
      return;
    }

    const data = {
      rating,
      feedback,
    };

    try {
      const response = await fetch(`/api/v1/attendance/event/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the token in the request header
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

  return (
    <div>
      <h2>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating:</label>
          <div style={{ display: "flex", cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => handleMouseEnter(star)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleRatingClick(star)}
                style={{
                  fontSize: "2rem",
                  color: star <= (hoveredRating || rating) ? "#ffc107" : "#e4e5e9",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div>
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            style={{ display: "block", width: "100%", margin: "10px 0" }}
          />
        </div>
        <button type="submit">Submit Review</button>
      </form>
      {message && <p>{message}</p>}
      <a href="/user">
        <button>Back</button>
      </a>
    </div>
  );
};

export default ReviewForm;
