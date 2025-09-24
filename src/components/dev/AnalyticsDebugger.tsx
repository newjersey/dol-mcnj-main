"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

declare const window: Window & {
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
};

interface AnalyticsEvent {
  timestamp: string;
  type: 'gtag' | 'dataLayer';
  event: string;
  data: any;
}

interface AnalyticsDebuggerProps {
  enabled?: boolean;
}

export function AnalyticsDebugger({ enabled = false }: AnalyticsDebuggerProps) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Store original functions
    const originalGtag = window.gtag;
    const originalDataLayerPush = window.dataLayer?.push;

        // Intercept gtag calls
    if (window.gtag) {
      const originalGtag = window.gtag;
      window.gtag = function(command: string, targetId?: string, parameters?: any) {
        if (command === 'event' && targetId) {
          setEvents(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            type: 'gtag',
            event: targetId,
            data: parameters
          }]);
        }
        return originalGtag(command, targetId, parameters);
      };
    }

    // Intercept dataLayer pushes
    if (window.dataLayer) {
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(data: any) {
        if (data.event) {
          setEvents(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            type: 'dataLayer',
            event: data.event,
            data: data
          }]);
        }
        return originalPush.call(this, data);
      };
    }

    // Cleanup
    return () => {
      if (originalGtag) window.gtag = originalGtag;
      if (originalDataLayerPush && window.dataLayer) {
        window.dataLayer.push = originalDataLayerPush;
      }
    };
  }, [enabled]);

  // Clear events when pathname changes for easier testing
  useEffect(() => {
    if (enabled) {
      setEvents([]);
    }
  }, [pathname, enabled]);

  if (!enabled) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      fontFamily: 'monospace',
    }}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        📊 Analytics Debug ({events.length})
      </button>

      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '0',
          width: '400px',
          maxHeight: '300px',
          overflow: 'auto',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '11px',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px',
            borderBottom: '1px solid #333',
            paddingBottom: '8px'
          }}>
            <h4 style={{ margin: 0, fontSize: '12px' }}>
              📊 Analytics Events - {pathname}
            </h4>
            <button 
              onClick={() => setEvents([])}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '2px 6px',
                borderRadius: '2px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>

          <div style={{ marginBottom: '8px', fontSize: '10px', color: '#888' }}>
            GTM Available: {typeof window !== 'undefined' && window.gtag ? '✅' : '❌'} | 
            DataLayer Available: {typeof window !== 'undefined' && window.dataLayer ? '✅' : '❌'}
          </div>

          {events.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
              No events captured yet. Navigate to trigger tracking.
            </div>
          ) : (
            events.map((event, index) => (
              <div 
                key={index}
                style={{ 
                  marginBottom: '8px',
                  padding: '6px',
                  backgroundColor: event.type === 'gtag' ? '#0066cc22' : '#00cc6622',
                  borderRadius: '4px',
                  border: `1px solid ${event.type === 'gtag' ? '#0066cc' : '#00cc66'}`
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontWeight: 'bold', color: event.type === 'gtag' ? '#4da6ff' : '#4dff88' }}>
                    {event.type.toUpperCase()}
                  </span>
                  <span style={{ color: '#888' }}>{event.timestamp}</span>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Event:</strong> {event.event}
                </div>
                <details>
                  <summary style={{ cursor: 'pointer', color: '#ccc' }}>View Data</summary>
                  <pre style={{ 
                    marginTop: '4px', 
                    fontSize: '10px', 
                    color: '#ddd',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}>
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </details>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}