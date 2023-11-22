// RedirectToExternal.tsx
import { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';

interface RedirectToNewTEProps extends RouteComponentProps {
    id?: string; // The dynamic segment of the path
    searchQuery?: string; // The dynamic segment of the path for search
}

const RedirectToNewTE: React.FC<RedirectToNewTEProps> = ({ id, searchQuery }) => {
    useEffect(() => {
        let redirectUrl = 'https://mycareer.nj.gov';

        if (id) {
            redirectUrl += `/training/${id}`;
        } else if (searchQuery !== undefined) { // Check for searchQuery, which can be an empty string
            redirectUrl += `/search/${searchQuery}`;
        } else if (window.location.pathname.startsWith('/search')) {
            redirectUrl += '/search';
        } else if (window.location.pathname.startsWith('/in-demand-occupations')) {
            redirectUrl += '/in-demand-occupations';
        } else {
            redirectUrl += '/training';
        }

        window.location.href = redirectUrl;
    }, [id, searchQuery]);

    return null; // This component does not render anything
};

export default RedirectToNewTE;
