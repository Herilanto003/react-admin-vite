export const BASE_URL = "http://localhost:8000";

export const capitalizeFont = (inputPhrase) => {
    const capitalizedPhrase = inputPhrase
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ');
    return capitalizedPhrase;
}