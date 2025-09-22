import React, { useEffect, useState } from 'react';
import { PathwayProvider, usePathway } from './pathway-provider';
import { PathwayRelatedContent } from './pathway-related-content';
import pathwaysData from './pathways.json';

interface PathwayData {
  id: string;
  title: string;
  description: string;
  occupations: any[];
  relatedContent?: any[];
}

const PathwaysContent: React.FC = () => {
  const [pathwayData, setPathwayData] = useState<PathwayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPathway } = usePathway();

  // Helper function to construct iframe URL with query parameters
  const getIframeUrl = (baseUrl: string): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryString = urlParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  useEffect(() => {
    const fetchPathwayData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Read query parameters from the URL using URLSearchParams
        const urlParams = new URLSearchParams(window.location.search);
        const queryString = urlParams.toString();

        // Get the default pathway (looking for a job pathway with ID 9)
        const defaultPathway = pathwaysData.pathways.find(p => p.pathwayId === "9");
        const pathwayId = defaultPathway?.pathwayId || "9";

        // Fetch pathway data with query parameters
        const data = await getPathway(pathwayId, queryString);
        setPathwayData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching pathway data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPathwayData();
  }, [getPathway]);

  if (loading) {
    return <div className="loading">Loading pathway data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!pathwayData) {
    return <div className="no-data">No pathway data available.</div>;
  }

  return (
    <div className="pathways-container">
      <div className="pathway-header">
        <h1>{pathwayData.title}</h1>
        <p>{pathwayData.description}</p>
      </div>

      <div className="pathway-content">
        {pathwayData.occupations && pathwayData.occupations.length > 0 && (
          <div className="occupations-section">
            <h2>Career Opportunities</h2>
            <div className="occupations-grid">
              {pathwayData.occupations.map((occupation: any) => (
                <div key={occupation.id} className="occupation-card">
                  <h3>{occupation.title}</h3>
                  {occupation.description && <p>{occupation.description}</p>}
                  {occupation.salaryRange && (
                    <div className="salary-range">
                      Salary Range: {occupation.salaryRange}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <PathwayRelatedContent pathwayId={pathwayData.id} />

        <div className="iframe-section">
          <h3>Explore More Resources</h3>
          <iframe
            src={getIframeUrl("/api/pathway-resources")}
            width="100%"
            height="400"
            frameBorder="0"
            title="Pathway Resources"
          />
        </div>
      </div>
    </div>
  );
};

export const Pathways: React.FC = () => {
  return (
    <PathwayProvider>
      <PathwaysContent />
    </PathwayProvider>
  );
};