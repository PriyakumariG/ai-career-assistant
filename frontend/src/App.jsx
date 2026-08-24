import { useState } from "react";
import { loginUser } from "./api/auth";

function App() {
  const [result, setResult] = useState(null);

  const testLogin = async () => {
    try {
      const response = await loginUser("priya@test.com", "testpass123");
      localStorage.setItem("access_token", response.data.access_token);
      setResult("Login successful! Token stored.");
    } catch (err) {
      setResult("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-text">
        AI Career <span className="text-accent">Assistant</span>
      </h1>
      <button
        onClick={testLogin}
        className="bg-accent hover:bg-accent-hover text-base font-semibold px-6 py-2 rounded-lg transition"
      >
        Test API Connection
      </button>
      {result && <p className="text-text-muted">{result}</p>}
    </div>
  );
}

export default App;