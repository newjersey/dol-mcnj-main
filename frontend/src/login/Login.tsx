import React, { useEffect } from 'react';

const Login = () => {
    useEffect(() => {
        // Redirect to an external URL as soon as the component mounts
        window.location.href = 'https://mycareer.nj.gov/navigator/#/login';
    }, []); // The empty array causes this effect to only run on mount

    // Optionally, you could return null or some placeholder content
    // to display nothing or some content while the page is redirecting.
    return null;
};

export default Login;
