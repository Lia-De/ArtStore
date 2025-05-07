export function formatUnixTime(unixSeconds) {
    const date = new Date(unixSeconds * 1000); // convert seconds to milliseconds
    return date.toLocaleString(); // returns date and time in local format
}