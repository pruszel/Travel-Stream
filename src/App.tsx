import "./App.css";
import React from "react";

function App() {
  const [clicked, setClicked] = React.useState(false);

  return (
    <>
      <h1 className="text-3xl font-bold">Hello, World!</h1>
      <br />
      <button
        className="btn"
        disabled={clicked}
        onClick={() => {
          setClicked(true);
        }}
      >
        {clicked ? "Thanks!" : "Click Me!"}
      </button>
    </>
  );
}

export default App;
