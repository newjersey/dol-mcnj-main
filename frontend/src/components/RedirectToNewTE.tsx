// RedirectToExternal.tsx
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import '../styles/components/_redirect-message.scss'; // Import the CSS for styling the message and spinner

interface RedirectToNewTEProps extends RouteComponentProps {
    id?: string; // The dynamic segment of the path
    searchQuery?: string; // The dynamic segment of the path for search
}

const RedirectToNewTE: React.FC<RedirectToNewTEProps> = ({ id, searchQuery }) => {
    // State to control whether to show the redirect message
    const [showRedirectMessage, setShowRedirectMessage] = useState(true);
    const [redirectUrl, setRedirectUrl] = useState('https://mycareer.nj.gov');

    useEffect(() => {
        if (id) {
            setRedirectUrl(redirectUrl => `${redirectUrl}/training/${id}`);
        } else if (searchQuery !== undefined) {
            setRedirectUrl(redirectUrl => `${redirectUrl}/search/${searchQuery}`);
        } else if (window.location.pathname.startsWith('/search')) {
            setRedirectUrl(redirectUrl => `${redirectUrl}/search`);
        } else if (window.location.pathname.startsWith('/in-demand-occupations')) {
            setRedirectUrl(redirectUrl => `${redirectUrl}/in-demand-occupations`);
        } else {
            setRedirectUrl(redirectUrl => `${redirectUrl}/training`);
        }


        // Set a timeout to redirect after 10 seconds
        const timer = setTimeout(() => {
            window.location.href = redirectUrl;
        }, 10000); // 10000 milliseconds equals 10 seconds

        // Cleanup function to clear the timer if the component is unmounted
        return () => clearTimeout(timer);
    }, [id, searchQuery]);

    return (
        <div className="redirect-container">
            {showRedirectMessage && (
                <div className="redirect-message">
                    <p>NJ Training Explorer has moved! All the same training and career info, now at
                        mycareer.nj.gov/training. Taking you there now...</p>
                    <div className="spinner"></div>
                    <p>Or <a href={redirectUrl} onClick={() => setShowRedirectMessage(false)}>click here</a> to go now.</p>
                </div>
            )}
        </div>
    );
};

export default RedirectToNewTE;
