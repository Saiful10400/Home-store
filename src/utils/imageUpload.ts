 export const imageUploadToDb = async (data:File) => {
 
    const image = new FormData();
    image.append("image", data);
  
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=1dee2a8fb008a9e4013e3fcb8506eceb`,
      {
        method: "POST",
        body: image,
      }
    );
  
    if (response.status === 400) throw new Error("Unsupported file!");
    const url = await response?.json();
  
    return url.data.url;
  };
  
  // const imageUpload = async (data) => {
  //   const dataArray = Object.values(data);
  //   const imageUrls = await Promise.all(dataArray.map(imageUploadToDb));
  //   return imageUrls
  // };
  
  // export default imageUpload;
  