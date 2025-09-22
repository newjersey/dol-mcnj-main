import React, { useEffect, useState } from 'react';

interface PathwayRelatedContentProps {
  pathwayId: string;
}

interface RelatedContent {
  id: string;
  title: string;
  description: string;
  url: string;
}

export const PathwayRelatedContent: React.FC<PathwayRelatedContentProps> = ({ pathwayId }) => {
  const [relatedContent, setRelatedContent] = useState<RelatedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Read query parameters from the current URL
        const urlParams = new URLSearchParams(window.location.search);
        const queryString = urlParams.toString();

        // Construct API URL with query parameters
        const baseUrl = `/api/pathway/${pathwayId}/related`;
        const apiUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch related content: ${response.statusText}`);
        }

        const data = await response.json();
        setRelatedContent(data.relatedContent || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching related content:', err);
      } finally {
        setLoading(false);
      }
    };

    if (pathwayId) {
      fetchRelatedContent();
    }
  }, [pathwayId]);

  if (loading) {
    return <div className="loading">Loading related content...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!relatedContent.length) {
    return <div className="no-content">No related content available.</div>;
  }

  return (
    <div className="pathway-related-content">
      <h3>Related Content</h3>
      <div className="content-grid">
        {relatedContent.map((item) => (
          <div key={item.id} className="content-card">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};