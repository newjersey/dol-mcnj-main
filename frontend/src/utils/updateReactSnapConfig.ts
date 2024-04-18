import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

const updateReactSnapConfig = async () => {
    try {
        const packageJsonPath = path.join(__dirname, '../../package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        const response = await axios.get('http://localhost:8080/api/training/ids');
        const programIds = response.data as string[];

        const newRoutes = programIds.map(id => `/training/${id}`);
        const existingRoutes = packageJson.reactSnap ? packageJson.reactSnap.include : [];

        // Combine and remove duplicates without using Set
        const combinedRoutes = [...existingRoutes, ...newRoutes];
        const uniqueRoutes = combinedRoutes.filter((route, index, self) => self.indexOf(route) === index);

        if (packageJson.reactSnap) {
            packageJson.reactSnap.include = uniqueRoutes;
        } else {
            packageJson.reactSnap = { include: uniqueRoutes };
        }

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('React Snap configuration updated successfully.');

    } catch (error) {
        console.error('Failed to fetch program paths from API or update React-Snap configuration:', error);
    }
};


updateReactSnapConfig();
