const dateStringToDateTime=(date:string)=>{
    const dateobj = new Date(date);

// // Format the date
// const formattedDate = dateobj.toLocaleDateString('en-US', {
//   year: 'numeric',
//   month: 'short',
//   day: 'numeric',
// });

// Format the time
const formattedTime = dateobj.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
 
return formattedTime
}


export default dateStringToDateTime