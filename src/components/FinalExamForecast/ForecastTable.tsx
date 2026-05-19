import type { ForecastRow } from '../../utils/forecast';

interface Props {
  forecastData: ForecastRow[];
}

function formatRange(row: ForecastRow): string {
  if (!row.achievable || !row.examRange) return 'Not achievable';
  const [min, max] = row.examRange;
  return min === max ? `${min}` : `${min} – ${max}`;
}

export default function ForecastTable({ forecastData }: Props) {
  // Split into three groups: above-range not-achievable, achievable, below-range not-achievable
  const firstAchievable = forecastData.findIndex(r => r.achievable);
  let lastAchievable = -1;
  for (let i = forecastData.length - 1; i >= 0; i--) {
    if (forecastData[i].achievable) { lastAchievable = i; break; }
  }

  const above     = firstAchievable > 0 ? forecastData.slice(0, firstAchievable) : [];
  const middle    = firstAchievable >= 0 ? forecastData.slice(firstAchievable, lastAchievable + 1) : [];
  const below     = lastAchievable >= 0 && lastAchievable < forecastData.length - 1
    ? forecastData.slice(lastAchievable + 1)
    : [];

  const aboveLabel = above.length > 0 ? above.map(r => r.letter).join(', ') : null;
  const belowLabel = below.length > 0 ? below.map(r => r.letter).join(', ') : null;

  const cellMuted = 'px-4 py-3 text-muted dark:text-[#9CA3AF] italic';
  const cellBold  = 'px-4 py-3 font-heading font-semibold tabular-nums text-primary dark:text-[#E8E8F0]';
  const cellNorm  = 'px-4 py-3 tabular-nums text-primary dark:text-[#E8E8F0]';
  const rowHighlight = 'bg-accent/10 dark:bg-[#6366F1]/10 border-b border-border-default dark:border-[#2D3048]';
  const rowMuted     = 'border-b border-border-default dark:border-[#2D3048]';

  return (
    <div className="overflow-hidden rounded-xl border border-border-default dark:border-[#2D3048]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface dark:bg-[#0F1117] border-b border-border-default dark:border-[#2D3048]">
            <th className="text-left px-4 py-3 font-heading font-semibold text-primary dark:text-[#E8E8F0]">
              Final Grade
            </th>
            <th className="text-left px-4 py-3 font-heading font-semibold text-primary dark:text-[#E8E8F0]">
              Exam Score Needed
            </th>
          </tr>
        </thead>
        <tbody>
          {aboveLabel && (
            <tr className={rowMuted}>
              <td className={cellMuted}>{aboveLabel}</td>
              <td className={cellMuted}>Not achievable</td>
            </tr>
          )}

          {middle.map((row, i) => (
            <tr key={row.letter} className={`${rowHighlight} ${i === middle.length - 1 ? 'last:border-0' : ''}`}>
              <td className={cellBold}>{row.letter}</td>
              <td className={cellNorm}>{formatRange(row)}</td>
            </tr>
          ))}

          {belowLabel && (
            <tr className="last:border-0">
              <td className={cellMuted}>{belowLabel}</td>
              <td className={cellMuted}>Not achievable</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
