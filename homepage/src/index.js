import Router from "preact-router";
import prerenderUrls from "../prerender-urls.json";
import Background from "./components/Background.js";
import Footer from "./components/Footer.js";
import Home from "./pages/Home.js";
import NotFound from "./pages/NotFound.js";
import Privacy from "./pages/Privacy.js";
import "./style.css";

const routerOnChange = (args) => {
  const currentPath = args.current.props.path;
  document.title =
    prerenderUrls.find((prerenderUrl) => prerenderUrl.url === currentPath)
      ?.title || "Not Found";
};

export default function App() {
  return (
    <main>
      <Background />
      <Router onChange={routerOnChange}>
        <Home path="/" />
        <Privacy path="/privacy" />
        <NotFound default />
      </Router>
      <Footer />
    </main>
  );
}
