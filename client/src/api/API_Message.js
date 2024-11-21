import axios from 'axios';


export const getMessages = async(userId, otherUserId)=>{
    try {
        const res = await axios.get(`/message`,{
            params:{
                userId:userId,
                otherUserId:otherUserId
            }
        });
        
        return res.data
    } catch (error) {
        console.log(error)
    }
}