//For LocalHost
import axiosInstance from "./axiosInstance";

 const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append image to form data
    formData.append('image', imageFile);

    try{
        const response = await axiosInstance.post('/image-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch(error){
        console.error("Error uploading the image", error);
        throw error; //Rethrow the error for handling
    }
 };

 export default uploadImage