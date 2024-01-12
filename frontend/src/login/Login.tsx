import { useEffect } from 'react';
import { Client } from "../domain/Client";

interface LoginProps {
    path?: string;
    client?: Client;
}

const Login: React.FC<LoginProps> = ({ path, client }) => {
    useEffect(() => {
        // Redirect to an external URL as soon as the component mounts
        window.location.href = 'https://mycareer.nj.gov/navigator/#/login';
    }, []); // The empty array causes this effect to only run on mount

    // Optionally, you could return null or some placeholder content
    // to display nothing or some content while the page is redirecting.
    return null;
};

export default Login;
