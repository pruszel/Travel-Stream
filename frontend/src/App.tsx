import "./App.css";
import { useState } from "react";

function App() {
  const [buttonText, setButtonText] = useState("Click me");
  const handleClick = () => {
    setButtonText("Thanks!");
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <button className="mt-4 btn" onClick={handleClick}>
        {buttonText}
      </button>
    </>
  );
}

export default App;
