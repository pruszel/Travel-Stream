import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReservationPage from "./components/ReservationPage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<h1>Hello World</h1>} />
          <Route path="/reserve" element={<ReservationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
