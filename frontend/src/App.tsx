import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/pages/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
