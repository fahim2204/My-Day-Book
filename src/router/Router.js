// ** Router imports
import { lazy } from "react";

// ** Router imports
import { useRoutes, Navigate } from "react-router-dom";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "../utility/Utils";

// ** GetRoutes
import { getRoutes } from "./routes";

// ** Components
const Login = lazy(() => import("../views/Login"));
const Register = lazy(() => import("../views/Register"));

const Router = () => {
  // ** Hooks
  const { layout } = useLayout();

  const allRoutes = getRoutes(layout);
  const getHomeRoute = () => {
    const user = getUserData();
    if (user) {
      return getHomeRouteForLoggedInUser(user.role);
    } else {
      return "/login";
    }
  };

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: "/login",
      element: <BlankLayout />,
      children: [{ path: "/login", element: <Login /> }],
    },
    {
      path: "/register",
      element: <BlankLayout />,
      children: [{ path: "/register", element: <Register /> }],
    },
    {
      path: "/auth/not-auth",
      element: <BlankLayout />,
      children: [
        { path: "/auth/not-auth", element: <>--not authorised---------</> },
      ],
    },
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <>-----------</> }],
    },
    ...allRoutes,
  ]);

  return routes;
};

export default Router;
