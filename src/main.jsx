import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n/i18n.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./config/client";

createRoot(document.getElementById("root")).render(
  <div>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </div>
);
