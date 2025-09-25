import React from 'react';
import { Pathways } from '../pathways';

// Simple demo page to test the pathways functionality
const PathwaysDemo: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Pathways Demo</h1>
      <p>This page demonstrates the pathways functionality with query parameter support.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test with different query parameters:</h3>
        <ul>
          <li><a href="?filter=healthcare">?filter=healthcare</a></li>
          <li><a href="?filter=healthcare&region=north">?filter=healthcare&region=north</a></li>
          <li><a href="?job_type=full-time&experience=entry">?job_type=full-time&experience=entry</a></li>
          <li><a href="?">No query parameters</a></li>
        </ul>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <Pathways />
      </div>
    </div>
  );
};

export default PathwaysDemo;