import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReservationPage from "./pages/ReservationPage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/reserve" element={<ReservationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
