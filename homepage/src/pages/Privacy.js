import Header from "../components/Header.js";
import Markdown from "../components/Markdown.js";
import privacy from "../content/privacy.md";

const Privacy = () => {
  return (
    <div class="container content">
      <Header />
      <Markdown content={privacy} />
    </div>
  );
};

export default Privacy;
