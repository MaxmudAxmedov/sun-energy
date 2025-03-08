import { RouterProvider } from "react-router-dom";
import { router } from "../router/router";
import { ThemeProvider } from "./ThemeProvider";

export default function RootProviders() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
