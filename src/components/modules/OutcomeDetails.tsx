import { ProgramOutcome } from '@/utils/types/components';
import { 
  getCompletionRate, 
  getCredentialRate, 
  getEmploymentRate, 
  getMedianSalary, 
  getTopIndustries,
  formatPercentage, 
  formatSalary,
  hasOutcomeData 
} from '@/utils/outcomeHelpers';

interface OutcomeDetailsProps {
  outcomes: ProgramOutcome;
  title?: string;
  className?: string;
}

export const OutcomeDetails = ({ outcomes, title = "Consumer Report Card", className = "" }: OutcomeDetailsProps) => {
  if (!hasOutcomeData(outcomes)) {
    return (
      <div className={`outcome-details ${className}`}>
        <h3>{title}</h3>
        <p>Outcome data not available for this program.</p>
      </div>
    );
  }

  const completionRate = getCompletionRate(outcomes);
  const credentialRate = getCredentialRate(outcomes);
  const employmentQ2 = getEmploymentRate(outcomes, 2);
  const employmentQ4 = getEmploymentRate(outcomes, 4);
  const salaryQ2 = getMedianSalary(outcomes, 2);
  const salaryQ4 = getMedianSalary(outcomes, 4);
  const industriesQ2 = getTopIndustries(outcomes, 2);
  const industriesQ4 = getTopIndustries(outcomes, 4);

  return (
    <div className={`outcome-details bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
      
      {/* Completion Metrics */}
      {(completionRate !== undefined || credentialRate !== undefined) && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-gray-800">Program Completion</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completionRate !== undefined && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{formatPercentage(completionRate)}</div>
                <div className="text-sm text-blue-700">Completion Rate</div>
              </div>
            )}
            {credentialRate !== undefined && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{formatPercentage(credentialRate)}</div>
                <div className="text-sm text-green-700">Credential Rate</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Employment Metrics */}
      {(employmentQ2 !== undefined || employmentQ4 !== undefined) && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-gray-800">Employment Outcomes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 6 Months Post-Graduation (Q2) */}
            {employmentQ2 !== undefined && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">6 Months After Graduation</h5>
                <div className="space-y-3">
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-xl font-bold text-purple-900">{formatPercentage(employmentQ2)}</div>
                    <div className="text-sm text-purple-700">Employment Rate</div>
                  </div>
                  {salaryQ2 !== undefined && (
                    <div className="bg-orange-50 p-3 rounded">
                      <div className="text-xl font-bold text-orange-900">{formatSalary(salaryQ2)}</div>
                      <div className="text-sm text-orange-700">Median Annual Salary</div>
                    </div>
                  )}
                  {industriesQ2.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Top Employment Industries:</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {industriesQ2.slice(0, 3).map((industry, index) => (
                          <li key={index} className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                            {industry.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 12 Months Post-Graduation (Q4) */}
            {employmentQ4 !== undefined && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">12 Months After Graduation</h5>
                <div className="space-y-3">
                  <div className="bg-indigo-50 p-3 rounded">
                    <div className="text-xl font-bold text-indigo-900">{formatPercentage(employmentQ4)}</div>
                    <div className="text-sm text-indigo-700">Employment Rate</div>
                  </div>
                  {salaryQ4 !== undefined && (
                    <div className="bg-yellow-50 p-3 rounded">
                      <div className="text-xl font-bold text-yellow-900">{formatSalary(salaryQ4)}</div>
                      <div className="text-sm text-yellow-700">Median Annual Salary</div>
                    </div>
                  )}
                  {industriesQ4.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Top Employment Industries:</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {industriesQ4.slice(0, 3).map((industry, index) => (
                          <li key={index} className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                            {industry.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4 border-t pt-3">
        <p>* Employment and salary data based on program graduates tracked through state employment records.</p>
        <p>* Industry classifications based on North American Industry Classification System (NAICS).</p>
      </div>
    </div>
  );
};