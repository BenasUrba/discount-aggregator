export const formatDate = (date) =>  {
    if (!date) return "";
    const cleanDate = date.split("T")[0];
    const [ , month, day] = cleanDate.split("-");
    return `${month}.${day}`;
}