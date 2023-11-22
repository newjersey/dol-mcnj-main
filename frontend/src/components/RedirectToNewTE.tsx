// RedirectToExternal.tsx
import { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';

interface RedirectToNewTEProps extends RouteComponentProps {
    id?: string; // The dynamic segment of the path
}

const RedirectToNewTE: React.FC<RedirectToNewTEProps> = ({ id }) => {
    useEffect(() => {
        const redirectUrl = id
            ? `https://mycareer.nj.gov/training/${id}`
            : 'https://mycareer.nj.gov/training';

        window.location.href = redirectUrl;
    }, [id]);

    return null; // This component does not render anything
};

export default RedirectToNewTE;
