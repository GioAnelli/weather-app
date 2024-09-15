import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./routes/layout/Layout";
import "./index.css";
import { Home } from "./routes/home/Home";
import { MainHome } from "./routes/home/main/MainHome";
import { SubHome } from "./routes/home/sub/SubHome";
import { Provider } from "react-redux";
import { store } from "./utils/redux/store/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "/",
            element: <MainHome />,
          },
          {
            path: "sub",
            element: <SubHome />,
          },
        ],
      },
      {
        path: "test",
        element: <p>secondo children</p>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
