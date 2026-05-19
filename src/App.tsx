import { HashRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import LandingPage from './components/LandingPage';
import GpaCalculator from './components/GpaCalculator/GpaCalculator';
import FinalExamForecast from './components/FinalExamForecast/FinalExamForecast';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-surface dark:bg-[#0F1117] text-primary dark:text-[#E8E8F0] font-body transition-colors duration-200">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gpa-calculator" element={<GpaCalculator />} />
            <Route path="/final-exam-forecast" element={<FinalExamForecast />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
