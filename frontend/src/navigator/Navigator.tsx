import React, { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';

const Navigator: React.FC<RouteComponentProps> = () => {
    useEffect(() => {
        window.location.href = 'https://mycareer.nj.gov/navigator/';
    }, []);

    return null;
};

export default Navigator;
