
export const reformatDate = (dateString) => {
    const date = new Date(dateString)
    let day = date.getDate()
    if(day < 10) day = "0" + day
    let month = date.getMonth() + 1
    if(month < 10) month = "0" + month
    let year = date.getFullYear()
    return day + "." + month + "." + year
}