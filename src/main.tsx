
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { initOpenClaw } from "./app/openclaw";
import "./styles/index.css";

initOpenClaw();

createRoot(document.getElementById("root")!).render(<App />);
  
