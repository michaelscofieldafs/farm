export const fetchImageByAddress = (address: string): string => {
    const url = `https://raw.githubusercontent.com/SavvyYield/token-image/refs/heads/main/${address}.png`;

    return url;
};