export default function stringToHexColor(inputString) {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;

        // Adjust the value to create softer shades (between 100 and 200)
        value = Math.floor(100 + (value % 101));

        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
}