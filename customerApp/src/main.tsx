import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer position="bottom-center" autoClose={1500} theme="colored" />
      <App />
    </AuthProvider>
  </StrictMode>,
);
