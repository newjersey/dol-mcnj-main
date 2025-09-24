import { render, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { SmartPageLoadTracker } from './SmartPageLoadTracker';
import { trackPageLoadTime, generateSmartPageName } from '../../utils/analytics';

// Mock the Next.js navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock the analytics utilities
jest.mock('../../utils/analytics', () => ({
  trackPageLoadTime: jest.fn(),
  generateSmartPageName: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockTrackPageLoadTime = trackPageLoadTime as jest.MockedFunction<typeof trackPageLoadTime>;
const mockGenerateSmartPageName = generateSmartPageName as jest.MockedFunction<typeof generateSmartPageName>;

describe('SmartPageLoadTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
    mockGenerateSmartPageName.mockReturnValue('MCNJ Homepage');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should track page load on mount using smart detection', () => {
    render(<SmartPageLoadTracker />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockGenerateSmartPageName).toHaveBeenCalledWith('/');
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('MCNJ Homepage', '/');
  });

  it('should use custom page name when provided', () => {
    const customPageName = 'Custom Page Name';
    
    render(<SmartPageLoadTracker pageName={customPageName} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockGenerateSmartPageName).not.toHaveBeenCalled();
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(customPageName, '/');
  });

  it('should use custom page URL when provided', () => {
    const customPageUrl = '/custom-url';
    
    render(<SmartPageLoadTracker pageUrl={customPageUrl} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockGenerateSmartPageName).toHaveBeenCalledWith(customPageUrl);
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('MCNJ Homepage', customPageUrl);
  });

  it('should use both custom page name and URL when provided', () => {
    const customPageName = 'Custom Page';
    const customPageUrl = '/custom-url';
    
    render(<SmartPageLoadTracker pageName={customPageName} pageUrl={customPageUrl} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockGenerateSmartPageName).not.toHaveBeenCalled();
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(customPageName, customPageUrl);
  });

  it('should disable smart detection when enableSmartDetection is false', () => {
    render(<SmartPageLoadTracker enableSmartDetection={false} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockGenerateSmartPageName).not.toHaveBeenCalled();
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('Page', '/');
  });

  it('should track page load when pathname changes', () => {
    const { rerender } = render(<SmartPageLoadTracker />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('MCNJ Homepage', '/');

    // Simulate pathname change
    mockUsePathname.mockReturnValue('/training');
    mockGenerateSmartPageName.mockReturnValue('Training Explorer Landing Page');

    rerender(<SmartPageLoadTracker />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('Training Explorer Landing Page', '/training');
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(2);
  });

  it('should work with different pathnames', () => {
    const testCases = [
      { pathname: '/', expectedName: 'MCNJ Homepage' },
      { pathname: '/training', expectedName: 'Training Explorer Landing Page' },
      { pathname: '/career-pathways', expectedName: 'Career Pathways Landing Page' },
      { pathname: '/programs/web-dev', expectedName: 'Program Details' },
    ];

    testCases.forEach(({ pathname, expectedName }, index) => {
      jest.clearAllMocks();
      mockUsePathname.mockReturnValue(pathname);
      mockGenerateSmartPageName.mockReturnValue(expectedName);

      render(<SmartPageLoadTracker key={index} />);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(mockGenerateSmartPageName).toHaveBeenCalledWith(pathname);
      expect(mockTrackPageLoadTime).toHaveBeenCalledWith(expectedName, pathname);
    });
  });

  it('should clear timeout on unmount', () => {
    const { unmount } = render(<SmartPageLoadTracker />);

    // Clear any existing timers
    act(() => {
      jest.clearAllTimers();
    });

    unmount();

    // Advance time to see if tracking would have been called
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTrackPageLoadTime).not.toHaveBeenCalled();
  });

  it('should handle component re-renders correctly', () => {
    const { rerender } = render(<SmartPageLoadTracker />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);

    // Re-render with different props
    rerender(<SmartPageLoadTracker pageName="New Page" />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(2);
    expect(mockTrackPageLoadTime).toHaveBeenLastCalledWith('New Page', '/');
  });

  it('should render without visual output', () => {
    const { container } = render(<SmartPageLoadTracker />);

    expect(container.firstChild).toBeNull();
  });

  it('should handle server-side rendering gracefully', () => {
    const originalWindow = global.window;
    (global as any).window = undefined;

    expect(() => {
      render(<SmartPageLoadTracker />);
    }).not.toThrow();

    global.window = originalWindow;
  });

  it('should handle analytics function errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock functions to throw errors
    mockGenerateSmartPageName.mockImplementation(() => {
      throw new Error('Smart detection failed');
    });
    mockTrackPageLoadTime.mockImplementation(() => {
      throw new Error('Tracking failed');
    });

    // Should not throw
    expect(() => {
      render(<SmartPageLoadTracker />);
      
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }).not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith('Error generating smart page name:', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Error tracking page load time:', expect.any(Error));
    
    consoleSpy.mockRestore();
    
    // Restore normal mock behavior for subsequent tests
    mockGenerateSmartPageName.mockReturnValue('MCNJ Homepage');
    mockTrackPageLoadTime.mockImplementation(() => {});
  });

  it('should work with complex URLs', () => {
    const complexUrl = '/programs/web-development?category=tech&level=beginner#overview';
    mockUsePathname.mockReturnValue(complexUrl);
    mockGenerateSmartPageName.mockReturnValue('Program Details');

    render(<SmartPageLoadTracker />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockGenerateSmartPageName).toHaveBeenCalledWith(complexUrl);
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('Program Details', complexUrl);
  });

  it('should handle prop changes correctly', () => {
    const { rerender } = render(<SmartPageLoadTracker pageName="Initial Page" />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('Initial Page', '/');

    // Change pageName prop
    rerender(<SmartPageLoadTracker pageName="Updated Page" />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('Updated Page', '/');

    // Change pageUrl prop  
    rerender(<SmartPageLoadTracker pageName="Updated Page" pageUrl="/new-url" />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith('Updated Page', '/new-url');
  });

  it('should delay tracking by 100ms', () => {
    render(<SmartPageLoadTracker />);

    // Should not track immediately
    expect(mockTrackPageLoadTime).not.toHaveBeenCalled();

    // Advance by 99ms - should still not track
    act(() => {
      jest.advanceTimersByTime(99);
    });
    expect(mockTrackPageLoadTime).not.toHaveBeenCalled();

    // Advance by 1ms more (total 100ms) - should now track
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(mockTrackPageLoadTime).toHaveBeenCalled();
  });
});