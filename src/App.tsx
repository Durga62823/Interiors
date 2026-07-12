import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";

export default function App() {
  return <RouterProvider router={getRouter()} />;
}