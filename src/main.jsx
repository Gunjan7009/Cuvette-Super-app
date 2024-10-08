import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import ErrorPage from "./routes/404";
import Categories from "./routes/categories";
import DashboardPage from "./routes/dashboard";
import ProfilePage from "./routes/Profile";
import EntertainmentPage from "./routes/entertainment";
import LoginPage from "./routes/login";

const router = createBrowserRouter([
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <DashboardPage />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },

  {
    path: "/entertainment",
    element: <EntertainmentPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
