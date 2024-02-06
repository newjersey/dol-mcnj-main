// ExternalRedirect.tsx
import { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';

interface ExternalRedirectProps extends RouteComponentProps {
    to: string;
}

const ExternalRedirect: React.FC<ExternalRedirectProps> = ({ to }) => {
    useEffect(() => {
        window.location.href = to;
    }, [to]);

    return null;
};

export default ExternalRedirect;
