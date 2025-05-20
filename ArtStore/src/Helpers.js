export function formatUnixTime(unixSeconds) {
    const date = new Date(unixSeconds * 1000); // convert seconds to milliseconds
    return date.toLocaleString(); // returns date and time in local format
}
export function formatDate(timeStamp) {

    const date = new Date(timeStamp);

    // return date.toLocaleDateString(); // returns date in local format
    return date.toLocaleTimeString() +' '+ date.toLocaleDateString(); // returns date and time in local format

}