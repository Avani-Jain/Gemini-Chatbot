// import React, { useState } from "react";

// function App() {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);

//  const fetchAnswer = async () => {
//   if (!question.trim()) {
//     setAnswer("Please enter a question.");
//     return;
//   }

//   setLoading(true);
//   setAnswer("");

//   try {
//     const response = await fetch("/qna/ask", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ question }),
//     });

//     const text = await response.text(); // ✅ parse as plain text instead of JSON
//     setAnswer(text);
//   } catch (error) {
//     console.error("Error fetching answer:", error);
//     setAnswer("Error fetching response from server.");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>Gemini Chatbot</h1>

//       <div style={styles.inputGroup}>
//         <label htmlFor="question" style={styles.label}>
//           Enter your question:
//         </label>
//         <textarea
//           id="question"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           style={styles.textarea}
//           rows={4}
//           placeholder="Type your question here..."
//         />
//         <button onClick={fetchAnswer} style={styles.button}>
//           Ask
//         </button>
//       </div>

//       <div style={styles.outputGroup}>
//         <label style={styles.label}>Answer:</label>
//         <div style={styles.answerBox}>
//           {loading ? "Loading..." : <pre style={styles.pre}>{answer}</pre>}
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     backgroundColor: "#ffffff",
//     color: "#003366",
//     fontFamily: "Arial, sans-serif",
//     padding: "40px",
//     textAlign: "center",
//   },
//   heading: {
//     marginBottom: "30px",
//   },
//   inputGroup: {
//     marginBottom: "30px",
//     maxWidth: "800px",
//     marginLeft: "auto",
//     marginRight: "auto",
//     textAlign: "left",
//   },
//   outputGroup: {
//     maxWidth: "800px",
//     marginLeft: "auto",
//     marginRight: "auto",
//     textAlign: "left",
//   },
//   label: {
//     fontWeight: "bold",
//     marginBottom: "8px",
//     display: "block",
//   },
//   textarea: {
//     width: "100%",
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #003366",
//     borderRadius: "5px",
//     backgroundColor: "#e6f0ff",
//     resize: "vertical",
//   },
//   button: {
//     marginTop: "10px",
//     padding: "10px 20px",
//     fontSize: "16px",
//     backgroundColor: "#003366",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   answerBox: {
//     border: "1px solid #003366",
//     padding: "15px",
//     borderRadius: "5px",
//     backgroundColor: "#e6f0ff",
//     minHeight: "100px",
//     whiteSpace: "pre-wrap",
//   },
//   pre: {
//     margin: 0,
//     fontFamily: "inherit",
//   },
// };

// export default App;
import React, { useEffect, useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(true);

  // Poll backend until available
  const checkBackend = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/qna/ping`); // Spring Boot actuator endpoint
      if (res.ok) {
        setBackendReady(true);
      } else {
        setTimeout(checkBackend, 3000); // Retry in 3s
      }
    } catch (err) {
      setTimeout(checkBackend, 3000); // Retry if fetch fails
    } finally {
      setCheckingBackend(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const fetchAnswer = async () => {
    if (!question.trim()) {
      setAnswer("Please enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/qna/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const text = await response.text();
      setAnswer(text);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Error fetching response from server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Gemini Chatbot</h1>

      {!backendReady ? (
        <p style={{ color: "#cc0000" }}>
          {checkingBackend ? "Checking backend..." : "Backend unavailable. Retrying..."}
        </p>
      ) : (
        <>
          <div style={styles.inputGroup}>
            <label htmlFor="question" style={styles.label}>
              Enter your question:
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={styles.textarea}
              rows={4}
              placeholder="Type your question here..."
            />
            <button onClick={fetchAnswer} style={styles.button} disabled={loading}>
              {loading ? "Loading..." : "Ask"}
            </button>
          </div>

          <div style={styles.outputGroup}>
            <label style={styles.label}>Answer:</label>
            <div style={styles.answerBox}>
              <pre style={styles.pre}>{answer}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Styles remain the same
const styles = {
  container: {
    backgroundColor: "#ffffff",
    color: "#003366",
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    textAlign: "center",
  },
  heading: {
    marginBottom: "30px",
  },
  inputGroup: {
    marginBottom: "30px",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
  },
  outputGroup: {
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
    display: "block",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #003366",
    borderRadius: "5px",
    backgroundColor: "#e6f0ff",
    resize: "vertical",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#003366",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  answerBox: {
    border: "1px solid #003366",
    padding: "15px",
    borderRadius: "5px",
    backgroundColor: "#e6f0ff",
    minHeight: "100px",
    whiteSpace: "pre-wrap",
  },
  pre: {
    margin: 0,
    fontFamily: "inherit",
  },
};

export default App;
