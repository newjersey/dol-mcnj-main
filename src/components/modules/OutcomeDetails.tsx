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
import { useState } from 'react';
import { CrcInfoDrawer } from '../../app/training/[code]/CrcInfoDrawer';

interface OutcomeDetailsProps {
  outcomes: ProgramOutcome;
  title?: string;
  className?: string;
}

export const OutcomeDetails = ({ outcomes, title = "Consumer report card", className = "" }: OutcomeDetailsProps) => {
  const [crcInfoDrawerOpen, setCrcInfoDrawerOpen] = useState(false);
  
  // Feature flag for CRC info drawer
  const showCrcInfoFeature = process.env.NEXT_PUBLIC_FEATURE_CRC_INFO === "true";
  
  // Ensure consistent data handling
  const safeOutcomes = outcomes || undefined;
  
  if (!hasOutcomeData(safeOutcomes)) {
    return null;
  }

  const completionRate = getCompletionRate(safeOutcomes);
  const employmentQ2 = getEmploymentRate(safeOutcomes, 2);
  const employmentQ4 = getEmploymentRate(safeOutcomes, 4);
  const salaryQ2 = getMedianSalary(safeOutcomes, 2);
  const salaryQ4 = getMedianSalary(safeOutcomes, 4);
  const industriesQ2 = getTopIndustries(safeOutcomes, 2);

  return (
    <>
      <div className={`bg-teal-50 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showCrcInfoFeature && (
            <button
              onClick={() => setCrcInfoDrawerOpen(true)}
              className="text-primary hover:text-primaryDark text-sm font-medium underline"
            >
              Learn more about the consumer report card
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 tabletMd:grid-cols-4 gap-4">
          {/* Completion percentage */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 leading-tight">Completion percentage</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPercentage(completionRate)}
            </div>
          </div>

          {/* Percent of employed graduates */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 16V8a6 6 0 0 1 12 0v8a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2Z"/>
                  <path d="M6 16.326A7 7 0 0 1 3 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6.326"/>
                  <path d="M2 21h20v-2H2z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 leading-tight">Percent of employed graduates</span>
            </div>
            <div className="space-y-1">
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatPercentage(employmentQ2, false)}</div>
                <div className="text-sm text-gray-600">at 6 months</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatPercentage(employmentQ4, false)}</div>
                <div className="text-sm text-gray-600">at 12 months</div>
              </div>
            </div>
          </div>

          {/* Median wage */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8v8H8V8h8zm2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/>
                  <path d="M12 10v4m-2-2h4"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 leading-tight">Median wage</span>
            </div>
            <div className="space-y-1">
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatSalary(salaryQ2)}</div>
                <div className="text-sm text-gray-600">at 6 months</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatSalary(salaryQ4)}</div>
                <div className="text-sm text-gray-600">at 12 months</div>
              </div>
            </div>
          </div>

          

          {/* Top three industries for completers */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 21V8l5-3 5 3v2h5v11H3Z"/>
                  <path d="M8 10h2v2H8v-2Zm0 4h2v2H8v-2Zm4-4h2v2h-2v-2Zm0 4h2v2h-2v-2Zm6 0h2v2h-2v-2Zm0 4h2v2h-2v-2Z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 leading-tight">Top three industries for completers</span>
            </div>
            <ul className="space-y-1 list-none">
              {industriesQ2.length > 0 ? (
                industriesQ2.slice(0, 3).map((industry, index) => (
                  <li key={industry.code} className="text-sm text-gray-700 leading-tight">
                    • {industry.title || `Sector ${index + 1}`}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 italic leading-tight">No industry data available.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {showCrcInfoFeature && (
        <CrcInfoDrawer
          crcInfoDrawerOpen={crcInfoDrawerOpen}
          setCrcInfoDrawerOpen={setCrcInfoDrawerOpen}
        />
      )}
    </>
  );
};