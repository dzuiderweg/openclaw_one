import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { FormOCR } from "./components/demos/FormOCR";
import { DesignReasoningChain } from "./components/demos/DesignReasoningChain";
import { Layout } from "./components/Layout";
import { OpenClawIntro } from "./components/OpenClawIntro";
import { DevProcessHub } from "./components/DevProcessHub";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "form-ocr", Component: FormOCR },
      { path: "design-reasoning-chain", Component: DesignReasoningChain },
      { path: "openclaw", Component: OpenClawIntro },
      { path: "dev-process", Component: DevProcessHub },
    ],
  },
]);
