// Helper function to format array into human-readable string
export const formatCountiesArrayToString = (counties: string[] = []) => {
    if(counties.length === 0) return '';
    if(counties.length === 1) return `${counties[0]} County`;

    const lastCountyIndex = counties.length - 1;
    if(counties.length === 2) return `${counties[0]} and ${counties[lastCountyIndex]} Counties`;

    const lastCounty = counties[lastCountyIndex];
    const remainingCounties = counties.slice(0, lastCountyIndex);
    return `${remainingCounties.join(', ')}, and ${lastCounty} Counties`;
};