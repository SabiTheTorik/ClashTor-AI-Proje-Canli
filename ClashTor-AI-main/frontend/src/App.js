import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Analyzer } from "./pages/Analyzer";
import { Profile } from "./pages/Profile";
import { Decks } from "./pages/Decks";
import { Premium } from "./pages/Premium";
import { Footer } from './components/Footer';
// --- YENİ İMPORTLAR ---
import { Contact } from './pages/Contact';
import { ReportBug } from './pages/ReportBug';
import { About } from "./pages/About";
import { Privacy } from './pages/Privacy';
import { ExampleAnalysis } from './pages/ExampleAnalysis';
import { Guides } from './pages/Guides';
import { GuideGolem } from './pages/GuideGolem';
import { GuideElixir } from './pages/GuideElixir';
import { GuideEvolution } from './pages/GuideEvolution';
import { GuidePekka } from './pages/GuidePekka';
import { GuideAiCaseStudy } from './pages/GuideAiCaseStudy';
// --- YENİ İMPORTLAR SONU ---

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/analyzer" element={<Analyzer />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/decks" element={<Decks />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/example-analysis" element={<ExampleAnalysis />} />

                {/* --- YENİ ROTALAR --- */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/report-bug" element={<ReportBug />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/guides/golem-meta-guide" element={<GuideGolem />} />
                <Route path="/guides/elixir-management-101" element={<GuideElixir />} />
                <Route path="/guides/evolution-mechanics" element={<GuideEvolution />} />
                <Route path="/guides/pekka-vs-mini-pekka" element={<GuidePekka />} />
                <Route path="/guides/ai-analysis-ice-spirit" element={<GuideAiCaseStudy />} />
                {/* --- YENİ ROTALAR SONU --- */}
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;