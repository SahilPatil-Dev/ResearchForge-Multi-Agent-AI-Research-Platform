import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes.tsx";
import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import NewResearch from "./pages/NewResearch";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResearchDetail from "./pages/ResearchDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            element={<AppLayout />}
          >
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/research/new"
              element={<NewResearch />}
            />

            <Route
              path="/research/:id"
              element={
                <ResearchDetail />
              }
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={
                <Navigate
                  to="/profile"
                  replace
                />
              }
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}