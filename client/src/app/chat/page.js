"use client";
import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "@/app/providers/AuthContext";
import { api, setAuthToken } from "@/utils/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const messageRef = useRef(null);
  const room = groupId || (selectedUser ? selectedUser._id : "defaultRoom");
  useEffect(() => {
    if (!user) return;
    setAuthToken(localStorage.getItem("token"));
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      socket.emit("userOnline", storedUser.id);
    }

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("userTyping", ({ username }) => setTyping(username));
    socket.on("userStoppedTyping", () => setTyping(null));
    const fetchUsers = async () => {
      const { data } = await api.get("/auth/users");
      setUsers(data?.users);
    };
    fetchUsers();
    socket.on("updateOnlineUsers", fetchUsers);
    fetchMessageHistory();

    return () => {
      if (storedUser) {
        socket.emit("userOffline", storedUser.id);
      }
      socket.off("updateOnlineUsers");
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.disconnect();
    };
  }, [user, selectedUser, groupId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      senderId: user?.id,
      content: message,
      room,
      groupId,
    };

    socket.emit("sendMessage", newMessage);
    setMessage("");

    try {
      await api.post("/messages", newMessage);
    } catch (error) {
      console.error("Message send error:", error);
    }
  };

  const handleTyping = () => {
    if (!user) return;
    socket.emit("typing", { username: user?.username, room });
    setTimeout(() => {
      socket.emit("stopTyping", { username: user?.username, room });
    }, 2000);
  };

  const fetchMessageHistory = async () => {
    try {
      const { data } = await api.get(`/messages/${room}`);
      setMessages(data);
    } catch (error) {
      console.error("Messages history error:", error);
    }
  };
  return (
    <div className="h-screen flex bg-[#111B21] text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#202C33] p-4 border-r border-gray-700 hidden md:block">
        <h3 className="text-lg font-semibold text-gray-300">Online Users</h3>
        <div className="mt-4 space-y-2">
          {users.map((u, index) => (
            <button
              key={index}
              className={`flex items-center px-4 py-3 rounded-lg w-full text-left transition  bg-[#128C7E] text-white" ${
                u?.userId === user?.id ? "hidden" : "block"
              } 
                  `}
            >
              <div
                className={`h-3 w-3 ${
                  u?.online ? "bg-green-400" : "bg-red-600"
                }  rounded-full`}
              ></div>
              <span className="ml-3">{u?.username}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {/* {selectedUser ? (
          <div className="p-4 bg-[#202C33] flex items-center justify-between border-b border-gray-700">
            <span className="text-lg font-semibold">
              {selectedUser?.username}
            </span>
            <span className="text-sm text-green-400">Online</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : ( */}
        <div className="p-4 bg-[#202C33] text-center flex text-gray-400">
          Messages
          <button className="ml-auto text-red-400" onClick={logout}>
            Logout
          </button>
        </div>
        {/* )} */}

        {/* Messages Area */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map(
            (msg, index) => (
              console.log("inside map", message),
              (
                <div
                  key={msg._id}
                  className={`p-3 max-w-xs rounded-xl shadow-md ${
                    (msg.sender?._id || msg.senderId) === user?.id
                      ? "ml-auto bg-[#128C7E]"
                      : " bg-[#2A3C44]"
                  }`}
                >
                  <p className="text-base">{msg.content}</p>
                </div>
              )
            )
          )}
          {typing && (
            <p className="text-sm text-green-400 animate-pulse">
              {typing} is typing...
            </p>
          )}
        </div>

        {/* Message Input */}
        <form
          onSubmit={sendMessage}
          className="p-4 bg-[#202C33] flex items-center border-t border-gray-700"
        >
          <input
            type="text"
            ref={messageRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            className="flex-1 p-3 bg-[#2A3C44] rounded-lg outline-none text-white"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 bg-[#128C7E] px-5 py-2 rounded-lg hover:bg-[#0F705E] shadow-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
