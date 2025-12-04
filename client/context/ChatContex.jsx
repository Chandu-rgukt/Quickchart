import { createContext, useState, useContext, useEffect } from "react";
import { AuthContex } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [message, setMessage] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const { socket, axios, authUser } = useContext(AuthContex);


    useEffect(() => {
        setPage(1);
        setHasMore(true);
    }, [selectedUser, selectedChannel]);

    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getChannels = async () => {
        try {
            const { data } = await axios.get("/api/channels");
    
            if (!authUser?._id) return;
    
            if (data.success) {
                const myChannels = data.channels.filter(ch =>
                    ch.members.some(m => m._id === authUser._id)
                );
    
                setChannels(myChannels);
    
                if (selectedChannel) {
                    const updated = myChannels.find(c => c._id === selectedChannel._id);
                    if (updated) setSelectedChannel(updated);
                    else setSelectedChannel(null);
                }
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
    
    

    const getMessages = async (userId, p = 1) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}?page=${p}`);
            if (data.success) {
                if (p === 1) setMessage(data.messages);
                else setMessage(prev => [...data.messages, ...prev]);
                if (data.messages.length === 0) setHasMore(false);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getChannelMessages = async (channelId, p = 1) => {
        try {
            const { data } = await axios.get(`/api/channels/${channelId}/messages?page=${p}`);
            if (data.success) {
                if (p === 1) setMessage(data.messages);
                else setMessage(prev => [...data.messages, ...prev]);
                if (data.messages.length === 0) setHasMore(false);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const addMemberToChannel = async (channelId, userId) => {
        try {
            const { data } = await axios.post(`/api/channels/${channelId}/join`, { userId });
            if (data.success) {
                toast.success("Member added");
                await getChannels();
            } else toast.error(data.message);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const removeMemberFromChannel = async (channelId, userId) => {
        try {
            const { data } = await axios.post(`/api/channels/${channelId}/remove`, { userId });
            if (data.success) {
                toast.success("Member removed");
                await getChannels();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const leaveChannel = async (channelId) => {
        try {
            const { data } = await axios.post(`/api/channels/${channelId}/leave`);
            if (data.success) {
                toast.success("You left the channel");
    
                // Remove from locally loaded channel to avoid stale UI
                setChannels(prev => prev.filter(c => c._id !== channelId));
    
                // Close current channel view
                setSelectedChannel(null);
    
                // Refresh list (ensures accuracy)
                getChannels();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteChannel = async (channelId) => {
        try {
            const { data } = await axios.delete(`/api/channels/${channelId}`);
            if (data.success) {
                toast.success("Channel deleted");
    
                setChannels(prev => prev.filter(c => c._id !== channelId));
                setSelectedChannel(null);
    
                getChannels();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
    
    

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) setMessage(prev => [...prev, data.newMessage]);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const sendChannelMessage = async (messageData) => {
        if (!socket) return;
        socket.emit("sendChannelMessage", {
            channelId: selectedChannel._id,
            message: messageData
        });
    };

    const subscribeToMessages = () => {
        if (!socket) return;

        socket.on("newChannelMessage", (msg) => {
            if (selectedChannel && msg.channelId === selectedChannel._id) {
                setMessage(prev => [...prev, msg]);
            }
        });

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessage(prev => [...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
                setUnseenMessages((prev) => ({ ...prev, [newMessage.senderId]: 0 }));
            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }));
            }
        });
    };

    const unSubscribeFromMessages = () => {
        if (!socket) return;
        socket.off("newMessage");
        socket.off("newChannelMessage");
    };

    useEffect(() => {
        subscribeToMessages();
        return () => unSubscribeFromMessages();
    }, [socket, selectedUser, selectedChannel]);

    const value = {
        axios,
        message,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        page,
        setPage,
        hasMore,
        setHasMore,
        channels,
        selectedChannel,
        setSelectedChannel,
        getChannels,
        getChannelMessages,
        sendChannelMessage,
        addMemberToChannel,
        removeMemberFromChannel,
        leaveChannel,
        deleteChannel
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
