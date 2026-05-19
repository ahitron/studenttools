import { Link } from 'react-router-dom';

interface ToolCardProps {
  title: string;
  description: string;
  to: string;
  icon: string;
}

function ToolCard({ title, description, to, icon }: ToolCardProps) {
  return (
    <div className="bg-panel dark:bg-[#1A1D27] border border-border-default dark:border-[#2D3048] rounded-2xl p-8 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-4xl">{icon}</div>
      <div>
        <h2 className="font-heading text-xl font-semibold text-primary dark:text-[#E8E8F0] mb-2">{title}</h2>
        <p className="text-muted dark:text-[#9CA3AF] text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto pt-2">
        <Link
          to={to}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 text-sm"
        >
          Open tool
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent dark:text-[#6366F1] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Built for PHS students
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary dark:text-[#E8E8F0] mb-4 leading-tight">
          PHS Student Tools
        </h1>
        <p className="text-muted dark:text-[#9CA3AF] text-lg max-w-xl mx-auto">
          Two tools to help you track your GPA and plan for finals — no login, no ads, all yours.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <ToolCard
          icon="📊"
          title="GPA Calculator"
          description="Calculate your credit-weighted GPA by year and cumulatively across all four years of high school. Supports CP, Honors, and AP course levels with PHS-specific grade point values."
          to="/gpa-calculator"
        />
        <ToolCard
          icon="📝"
          title="Final Exam Forecast"
          description="Enter your four marking period grades and instantly see what exam score you need to hit any final course grade. Know exactly where you stand before walking into finals week."
          to="/final-exam-forecast"
        />
      </div>

      <p className="text-center text-muted dark:text-[#9CA3AF] text-xs mt-12">
        All data is saved locally in your browser. Nothing is sent to a server.
      </p>
    </div>
  );
}
