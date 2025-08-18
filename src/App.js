
import { Routes, Route } from 'react-router-dom'

import Navbar from "./layouts/Navbar";
import Home from "./layouts/Home";
import Footer from "./layouts/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signin from "./users/Signin";
import Signup from "./users/Signup";
import Projects from "./pages/Projects";
import Error from "./pages/Error";
import Service from './pages/Service';

function App() {
  return (
    <div className="w-full relative overflow-x-hidden bg-gradient-to-br from-indigo-950 to-green-950 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services" element={<Service />} />
        <Route path='/*' element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
