import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { FormOCR } from "./components/demos/FormOCR";
import { DesignReasoningChain } from "./components/demos/DesignReasoningChain";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "form-ocr", Component: FormOCR },
      { path: "design-reasoning-chain", Component: DesignReasoningChain },
    ],
  },
]);
