"use client";
import { ProgramOutcome } from '@utils/types/components';
import { 
  getCompletionRate, 
  getEmploymentRate, 
  getMedianSalary, 
  getTopIndustries,
  formatPercentage, 
  formatSalary,
  hasOutcomeData 
} from '@utils/outcomeHelpers';

interface OutcomeDetailsProps {
  outcomes: ProgramOutcome;
  title?: string;
  className?: string;
}

export const OutcomeDetails = ({ outcomes, title = "Consumer Report Card", className = "" }: OutcomeDetailsProps) => {
  // Ensure consistent data handling
  const safeOutcomes = outcomes || undefined;
  
  if (!hasOutcomeData(safeOutcomes)) {
    return (
      <div className={`outcome-details ${className}`}>
        <h3>{title}</h3>
        <p>Outcome data not available for this program.</p>
      </div>
    );
  }

  const completionRate = getCompletionRate(safeOutcomes);
  const employmentQ2 = getEmploymentRate(safeOutcomes, 2);
  const employmentQ4 = getEmploymentRate(safeOutcomes, 4);
  const salaryQ2 = getMedianSalary(safeOutcomes, 2);
  const salaryQ4 = getMedianSalary(safeOutcomes, 4);
  const industriesQ2 = getTopIndustries(safeOutcomes, 2);

  return (
    <div className={`outcome-details bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="text-blue-600">
          <span className="text-sm">Learn more about the </span>
          <a href="#" className="text-blue-600 underline">Consumer Report Card</a>
        </div>
      </div>
      
      <div className="flex items-start gap-6">
        {/* Column 1: Icon and main completion rate */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative">
            {/* Graduation cap icon with chart background */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center relative">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
              {/* Small chart icon overlay */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Completion rate */}
          <div>
            <div className="text-4xl font-bold text-gray-900">
              {formatPercentage(completionRate)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-medium">Completion rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Employment metrics */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-2.5l-1.5-1.5h-5L9.5 6H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H7V8h2.5l1.5-1.5h5L17.5 8H20v10z"/>
            </svg>
            <span className="font-medium text-gray-900">Percent employed</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatPercentage(employmentQ2)}
            </div>
            <div className="text-sm text-gray-600">at 6 months</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPercentage(employmentQ4)}
            </div>
            <div className="text-sm text-gray-600">at 12 months</div>
          </div>
        </div>

        {/* Column 3: Salary metrics */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
            <span className="font-medium text-gray-900">Median wage</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatSalary(salaryQ2)}
            </div>
            <div className="text-sm text-gray-600">at 6 months</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatSalary(salaryQ4)}
            </div>
            <div className="text-sm text-gray-600">at 12 months</div>
          </div>
        </div>

        {/* Column 4: Where completers work */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-3">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="font-medium text-gray-900">Where completers work</span>
          </div>
          <div className="space-y-1">
            {industriesQ2.slice(0, 3).map((industry, index) => (
              <div key={industry.code} className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{index + 1}.</span> {industry.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};