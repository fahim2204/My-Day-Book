// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";
import PrivateRoute from "@components/routes/PrivateRoute";

// ** Utils
import { isObjEmpty } from "@utils";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/dashboard";

const Home = lazy(() => import("../../views/Home"));
const AccountSettings = lazy(() =>
  import("../../views/pages/Cashbook-settings")
);
const BusinessSettings = lazy(() =>
  import("../../views/pages/Business-settings")
);
const TransactionDetails = lazy(() => import("../../views/TransactionDetails"));
const AllNotes = lazy(() => import("../../views/AllNotes"));
const Books = lazy(() => import("../../views/apps/Books"));
const SecondPage = lazy(() => import("../../views/AddBusiness"));
const AddNote = lazy(() => import("../../views/AddNote"));
const Login = lazy(() => import("../../views/Login"));
const Register = lazy(() => import("../../views/Register"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const Error = lazy(() => import("../../views/Error"));
const Dashboard = lazy(() => import("../../views/DashboardReport"));
const UserList = lazy(() => import("../../views/apps/user/list"));
// const UserView = lazy(() => import('../../views/apps/user/view'))
// ** Merge Routesimport AccountSettings from './../../views/pages/account-settings/index';

const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    meta: {
      className: "kanban-application",
    },
  },
  {
    path: "/home",
    element: <Home />,
    meta: {
      className: "kanban-application",
    },
  },
  {
    path: "/business",
    element: <Home />,
    meta: {
      className: "kanban-application",
    },
  },
  {
    path: "/business/:id",
    element: <Home />,
  },
  {
    path: "/business/create",
    element: <SecondPage />,
  },
  {
    path: "/book/:param_id/transactions",
    element: <TransactionDetails />,
  },
  {
    path: "/book/:param_id/settings/*",
    element: <AccountSettings />,
  },
  {
    path: "/business/:param_id/settings/*",
    element: <BusinessSettings />,
  },
  {
    path: "/notes/",
    element: <AllNotes />,
  },
  {
    path: "/note/add",
    element: <AddNote />,
  },
  {
    element: <UserList />,
    path: "/users",
  },
  {
    path: "/second-page",
    element: <SecondPage />,
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute;
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
