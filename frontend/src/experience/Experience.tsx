import { useEffect } from 'react';
import {Client} from "../domain/Client";

interface ExperienceProps {
    path?: string;
    client?: Client;
}

const Experience: React.FC<ExperienceProps> = ({ path, client }) => {
    useEffect(() => {
        // Redirect to an external URL as soon as the component mounts
        window.location.href = 'https://mycareer.nj.gov/navigator/#/experience';
    }, []); // The empty array causes this effect to only run on mount

    // Optionally, you could return null or some placeholder content
    // to display nothing or some content while the page is redirecting.
    return null;
};

export default Experience;
