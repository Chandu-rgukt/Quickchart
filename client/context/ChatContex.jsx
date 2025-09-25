import { createContext, useState, useContext, useEffect } from "react";
import { AuthContex } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({children})=>{

    const [message, setMessage] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const {socket, axios} = useContext(AuthContex);

    const getUsers =async () =>{

        try{
            const { data } = await axios.get("/api/messages/users")
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }

        }catch(error){
            toast.error(error.message);

        }

    }


    const getMessages = async (userId)=>{
        try{

            const { data } = await axios.get(`/api/messages/${userId}`) 
            if(data.success){
                setMessage(data.messages)
                // reset unseen count for this user locally
                setUnseenMessages((prev) => ({
                    ...prev,
                    [userId]: 0
                }));
            }

        }catch(error){

            toast.error(error.message);

        }
    }


    const sendMessage = async (messageData)=>{
        try{

            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessage((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message);
        }
    }

    const subscribeToMessages = async () =>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessage((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
                // ensure unseen count for this user is zero while chat is open
                setUnseenMessages((prev)=> ({
                    ...prev,
                    [newMessage.senderId]: 0
                }))
            }else{
                setUnseenMessages((prev) => ({
                     ...prev,
                     [newMessage.senderId]: prev[newMessage.senderId] 
                        ? prev[newMessage.senderId] + 1   : 1
                    }));

            }
        })
    }

    const unSubscribeFromMessages = () =>{
        if(socket) socket.off("newMessage")
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=>unSubscribeFromMessages();
    }, [socket, selectedUser])



    const value = {
        message,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages


    }

    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )

}
