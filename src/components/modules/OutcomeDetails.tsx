"use client";
// Updated with Phosphor icons and horizontal layout
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
import { CrcInfoDrawer } from './CrcInfoDrawer';
import { BriefcaseIcon, BuildingOfficeIcon, GraduationCapIcon, MoneyWavyIcon, Warning } from '@phosphor-icons/react';

interface OutcomeDetailsProps {
  outcomes: ProgramOutcome;
  title?: string;
  className?: string;
  horizontal?: boolean;
}

export const OutcomeDetails = ({ outcomes, title = "Consumer report card", className = "", horizontal = false }: OutcomeDetailsProps) => {
  const [crcInfoDrawerOpen, setCrcInfoDrawerOpen] = useState(false);
  
  // Feature flag for CRC info drawer
  const showCrcInfoFeature = process.env.NEXT_PUBLIC_FEATURE_CRC_INFO === "true";
  
  // Ensure consistent data handling
  const safeOutcomes = outcomes || undefined;
  
  // Always show the component, but check if there's any data to show cards
  const completionRate = getCompletionRate(safeOutcomes);
  const employmentQ2 = getEmploymentRate(safeOutcomes, 2);
  const employmentQ4 = getEmploymentRate(safeOutcomes, 4);
  const salaryQ2 = getMedianSalary(safeOutcomes, 2);
  const salaryQ4 = getMedianSalary(safeOutcomes, 4);
  const industriesQ2 = getTopIndustries(safeOutcomes, 2);

  // Check if there's any data at all
  const hasAnyData = hasOutcomeData(safeOutcomes);

  // If no data at all, show warning message
  if (!hasAnyData) {
    return (
      <>
        <div className={`bg-teal-50 rounded-lg p-4 ${className}`}>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            {showCrcInfoFeature && (
              <button
                onClick={() => setCrcInfoDrawerOpen(true)}
                className="text-primary hover:text-primaryDark text-sm font-medium underline"
              >
                Learn more about the consumer report card
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Warning className="w-5 h-5 text-black flex-shrink-0" weight="regular" />
            <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
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
  }

  // Horizontal layout for display with InfoBlocks
  if (horizontal) {
    return (
      <>
        <div className={`bg-teal-50 rounded-lg p-4 ${className}`}>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            {showCrcInfoFeature && (
              <button
                onClick={() => setCrcInfoDrawerOpen(true)}
                className="text-primary hover:text-primaryDark text-sm font-medium underline"
              >
                Learn more about the consumer report card
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 items-start">
            {/* FIXED ORDER: Employment → Wage → Completion → Industries */}
            
            {/* 1st: Percent of employed graduates */}
            <div className="bg-white rounded-lg p-3 shadow-sm min-w-[200px] flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BriefcaseIcon className="w-4 h-4 text-blue-600 flex-shrink-0" weight="duotone" />
                <span className="text-sm font-normal text-black leading-tight">Percent of employed graduates</span>
              </div>
              {!employmentQ2 && !employmentQ4 ? (
                <div className="flex items-center gap-2">
                  <Warning className="w-4 h-4 text-black flex-shrink-0" weight="regular" />
                  <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-base font-bold text-black">{employmentQ2 ? `${parseFloat(employmentQ2.toString()).toFixed(1)}%` : 'N/A'} <span className="text-sm text-black font-normal">at 6 months</span></div>
                  <div className="text-base font-bold text-black">{employmentQ4 ? `${parseFloat(employmentQ4.toString()).toFixed(1)}%` : 'N/A'} <span className="text-sm text-black font-normal">at 12 months</span></div>
                </div>
              )}
            </div>

            {/* 2nd: Median wage */}
            <div className="bg-white rounded-lg p-3 shadow-sm min-w-[200px] flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MoneyWavyIcon className="w-4 h-4 text-blue-600 flex-shrink-0" weight="duotone" />
                <span className="text-sm font-normal text-black leading-tight">Median wage</span>
              </div>
              {!salaryQ2 && !salaryQ4 ? (
                <div className="flex items-center gap-2">
                  <Warning className="w-4 h-4 text-black flex-shrink-0" weight="regular" />
                  <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-base font-bold text-black">{formatSalary(salaryQ2)} <span className="text-sm text-black font-normal">at 6 months</span></div>
                  <div className="text-base font-bold text-black">{formatSalary(salaryQ4)} <span className="text-sm text-black font-normal">at 12 months</span></div>
                </div>
              )}
            </div>

            {/* 3rd: Completion percentage */}
            <div className="bg-white rounded-lg p-3 shadow-sm min-w-[200px] flex-1">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCapIcon className="w-4 h-4 text-blue-600 flex-shrink-0" weight="duotone" />
                <span className="text-sm font-normal text-black leading-tight">Completion percentage</span>
              </div>
              {!completionRate ? (
                <div className="flex items-center gap-2">
                  <Warning className="w-4 h-4 text-black flex-shrink-0" weight="regular" />
                  <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
                </div>
              ) : (
                <div className="text-lg font-bold text-black">{(completionRate * 100).toFixed(1)}%</div>
              )}
            </div>

            {/* 4th: Top three industries for completers */}
            <div className="bg-white rounded-lg p-3 shadow-sm min-w-[200px] flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BuildingOfficeIcon className="w-4 h-4 text-blue-600 flex-shrink-0" weight="duotone" />
                <span className="text-sm font-normal text-black leading-tight">Leading industries for graduates</span>
              </div>
              {industriesQ2.length === 0 ? (
                <div className="flex items-center gap-2">
                  <Warning className="w-4 h-4 text-black flex-shrink-0" weight="regular" />
                  <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
                </div>
              ) : (
                <ul className="space-y-0.5 list-none">
                  {industriesQ2.slice(0, 3).map((industry, index) => (
                    <li key={industry.code} className="text-base font-bold text-black leading-tight">
                      • {industry.title || `Sector ${index + 1}`}
                    </li>
                  ))}
                </ul>
              )}
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
  }

  // Default vertical layout
  return (
    <>
      <div className={`bg-teal-50 rounded-lg p-6 ${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
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
          {/* Percent of employed graduates */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BriefcaseIcon className="w-5 h-5 text-blue-600" weight="duotone" />
              </div>
              <span className="text-sm font-medium text-black leading-tight">Percent of employed graduates</span>
            </div>
            {!employmentQ2 && !employmentQ4 ? (
              <div className="flex items-center gap-2">
                <Warning className="w-5 h-5 text-black flex-shrink-0" weight="regular" />
                <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-base font-bold text-black">{formatPercentage(employmentQ2, false)} <span className="text-sm text-black font-normal">at 6 months</span></div>
                <div className="text-base font-bold text-black">{formatPercentage(employmentQ4, false)} <span className="text-sm text-black font-normal">at 12 months</span></div>
              </div>
            )}
          </div>

          {/* Median wage */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MoneyWavyIcon className="w-5 h-5 text-blue-600" weight="duotone" />
              </div>
              <span className="text-sm font-medium text-black leading-tight">Median wage</span>
            </div>
            {!salaryQ2 && !salaryQ4 ? (
              <div className="flex items-center gap-2">
                <Warning className="w-5 h-5 text-black flex-shrink-0" weight="regular" />
                <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-base font-bold text-black">{formatSalary(salaryQ2)} <span className="text-sm text-black font-normal">at 6 months</span></div>
                <div className="text-base font-bold text-black">{formatSalary(salaryQ4)} <span className="text-sm text-black font-normal">at 12 months</span></div>
              </div>
            )}
          </div>

          {/* Completion percentage */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCapIcon className="w-5 h-5 text-blue-600" weight="duotone" />
              </div>
              <span className="text-sm font-medium text-black leading-tight">Completion percentage</span>
            </div>
            {!completionRate ? (
              <div className="flex items-center gap-2">
                <Warning className="w-5 h-5 text-black flex-shrink-0" weight="regular" />
                <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
              </div>
            ) : (
              <div className="text-lg font-bold text-black">{(completionRate * 100).toFixed(1)}%</div>
            )}
          </div>

          {/* Top three industries for completers */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BuildingOfficeIcon className="w-5 h-5 text-blue-600" weight="duotone" />
              </div>
              <span className="text-sm font-medium text-black leading-tight">Leading industries for graduates</span>
            </div>
            {industriesQ2.length === 0 ? (
              <div className="flex items-center gap-2">
                <Warning className="w-5 h-5 text-black flex-shrink-0" weight="regular" />
                <span className="text-lg font-bold text-black m-0 leading-tight">Data unreported</span>
              </div>
            ) : (
              <ul className="space-y-0.5 list-none">
                {industriesQ2.slice(0, 3).map((industry, index) => (
                  <li key={industry.code} className="text-base font-bold text-black leading-tight">
                    • {industry.title || `Sector ${index + 1}`}
                  </li>
                ))}
              </ul>
            )}
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