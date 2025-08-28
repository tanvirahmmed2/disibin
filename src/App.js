import { Routes, Route } from "react-router-dom";

import Navbar from "./layouts/Navbar";
import Home from "./layouts/Home";
import Footer from "./layouts/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Signin from "./users/Signin";
import Signup from "./users/Signup";
import Projects from "./pages/Projects";
import Error from "./pages/Error";
import Services from "./pages/Services";
import Project from "./pages/Project";
import Care from "./pages/Care";
import GraphicsDesign from "./pages/GraphicsDesign";
import WebDev from "./pages/WebDev";
import WebDesign from "./pages/WebDesign";

function App() {
  return (
    <div className="w-full relative overflow-x-hidden bg-gradient-to-br from-indigo-900 to-green-900 text-white">
      <Navbar />
      <div className="w-full h-auto mt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/services" element={<Services />} />
          <Route path="/webdesign" element={<WebDesign />} />
          <Route path="/webdev" element={<WebDev />} />
          <Route path="/graphicsdesign" element={<GraphicsDesign />} />
          <Route path="/care" element={<Care />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:title" element={<Project />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
