// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Todo = lazy(() => import("../../views/apps/todo"));

const AppRoutes = [
  {
    element: <Todo />,
    path: "bussiness/books",
    meta: {
      appLayout: true,
      className: "Haxor Bussiness",
    },
  },
];

export default AppRoutes;
