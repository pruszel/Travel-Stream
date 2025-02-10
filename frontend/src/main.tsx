import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Root from "./Root.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import Home from "./pages/Home.tsx";
import TripList from "./pages/TripList.tsx";
import NewTrip from "./pages/NewTrip.tsx";
import Trip from "./pages/Trip.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="trips" element={<TripList />}>
              <Route path="new" element={<NewTrip />} />
              <Route path=":tripid" element={<Trip />} />
            </Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
