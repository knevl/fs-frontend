export function getApiUrl(): string {
    const { hostname } = window.location;
    if (hostname === 'localhost') {
      return 'http://localhost:3000';
    }
    return `https://api.${hostname}`;
  }