import React from 'react';

export default function Home() {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f9f9f9', // Subtle off-white background
      fontFamily: 'Arial, sans-serif',
    } as React.CSSProperties,
    title: {
      fontSize: '2.5rem',
      color: '#202124', // Google's dark text color
      marginBottom: '2rem',
    } as React.CSSProperties,
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
    } as React.CSSProperties,
    link: {
      textDecoration: 'none',
    } as React.CSSProperties,
    button: {
      padding: '0.8rem 1.5rem',
      fontSize: '1rem',
      color: '#fff',
      backgroundColor: '#4285F4', // Google's blue
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    } as React.CSSProperties,
    buttonHover: {
      backgroundColor: '#357ae8', // Slightly darker blue for hover
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Calendify!</h1>
      <div style={styles.buttonContainer}>
        <a href="http://localhost:5097/login" style={styles.link}>
          <button
            style={styles.button}
            onMouseOver={(e) => {
              (e.currentTarget.style.backgroundColor as string) = styles.buttonHover.backgroundColor;
            }}
            onMouseOut={(e) => {
              (e.currentTarget.style.backgroundColor as string) = styles.button.backgroundColor!;
            }}
          >
            Login
          </button>
        </a>
        <a href="http://localhost:5097/register" style={styles.link}>
          <button
            style={styles.button}
            onMouseOver={(e) => {
              (e.currentTarget.style.backgroundColor as string) = styles.buttonHover.backgroundColor;
            }}
            onMouseOut={(e) => {
              (e.currentTarget.style.backgroundColor as string) = styles.button.backgroundColor!;
            }}
          >
            Create account
          </button>
        </a>
      </div>
    </div>
  );
}
