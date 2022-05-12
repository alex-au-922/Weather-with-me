const convertISOToDateTimeString = (timeString) => {
    var date = new Date(Date.parse(timeString));
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDate().toString();
    const hours = date.getHours().toString().padStart(2, 0);
    const minutes = date.getMinutes().toString().padStart(2, 0);
    const seconds = date.getSeconds().toString().padStart(2, 0);
    return year + "/" + month + "/" + day + "  " + hours + ":" + minutes + ":" + seconds;
  };

export default convertISOToDateTimeString;