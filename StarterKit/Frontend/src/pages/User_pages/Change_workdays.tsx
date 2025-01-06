import React, { useState, useEffect } from "react";

// Helper function to manage workdays selection
const workdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ChangeWorkdaysPage: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // To store selected workdays
  const [message, setMessage] = useState<string>(""); // To store messages (success or error)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // To track if user is logged in
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state

  // Check login status and retrieve token
  useEffect(() => {
    const authToken = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    console.log("AuthToken retrieved from localStorage:", authToken);

    if (authToken) {
      setIsLoggedIn(true); // Mark user as logged in
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false); // Stop the loading indicator
  }, []);

  // Handle checkbox change (workday selection)
  const handleDayChange = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((selectedDay) => selectedDay !== day)
        : [...prevSelectedDays, day]
    );
  };

  // Submit selected workdays to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (selectedDays.length === 0) {
      setMessage("Please select at least one workday.");
      return;
    }
  
    const authToken = localStorage.getItem("authToken"); // Retrieve the token again
    if (!authToken) {
      setMessage("You need to log in to update workdays.");
      return;
    }
  
    const newWorkdays = selectedDays.join(", "); // Join selected days into a string
  
    try {
      const response = await fetch("/api/v1/attendance/workdays", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the token for authentication
        },
        body: JSON.stringify({
          NewDays: newWorkdays, // Send the selected workdays as a string
        }),
      });
  
      if (response.ok) {
        setMessage("Workdays updated successfully.");
        setTimeout(() => {
          window.location.href = "/user"; // Redirect to /user after 2 seconds
        }, 2000); // Adjust delay as needed
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update workdays.");
      }
    } catch (error) {
      setMessage("An error occurred while updating workdays.");
      console.error("Error:", error);
    }
  };
  

  // If still loading, show a spinner or message
  if (loading) {
    return <p>Loading...</p>;
  }

  // If user is not logged in, show the message
  if (!isLoggedIn) {
    return <p>You must be logged in to update workdays.</p>;
  }

  return (
    <div>
      <h1>Change Workdays</h1>

      {/* Display success/error message */}
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <h3>Select Your Workdays</h3>
        <div>
          {workdays.map((day) => (
            <div key={day}>
              <input
                type="checkbox"
                id={day}
                name={day}
                value={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleDayChange(day)}
              />
              <label htmlFor={day}>{day}</label>
            </div>
          ))}
        </div>

        <button type="submit">Submit</button>
      </form>

      {/* Back Button */}
      <a href="/user">
        <button>Back</button>
      </a>
    </div>
  );
};

export default ChangeWorkdaysPage;
