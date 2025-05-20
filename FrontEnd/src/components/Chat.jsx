import { useQuery, gql } from "@apollo/client";
import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../Context/AppContext";

const GET_ALL_USERS = gql`
  query {
    allUsers {
      name
      role
    }
  }
`;

const Chat = () => {
  const { currUser } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const socketRef = useRef(null);

  const { loading, error, data } = useQuery(GET_ALL_USERS);

  const shift = 3;

  const caesarEncrypt = (text, shift) =>
    text
      .split("")
      .map((char) => {
        const isUpper = char >= "A" && char <= "Z";
        const isLower = char >= "a" && char <= "z";

        if (isUpper) return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        if (isLower) return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        return char;
      })
      .join("");

  const caesarDecrypt = (text, shift) => caesarEncrypt(text, 26 - (shift % 26));

  useEffect(() => {
    if (!currUser || !currentUser) return;

    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      socketRef.current.send(
        JSON.stringify({
          sender: currUser.name,
          recipient: currentUser,
          type: "init",
        })
      );
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "history") {
          const decryptedHistory = data.messages.map((msg) => ({
            from: msg.from,
            message: caesarDecrypt(msg.message, shift),
          }));
          setMessages(decryptedHistory);
        } else if (data.type === "chat") {
          const decryptedMsg = caesarDecrypt(data.message, shift);
          setMessages((prev) => [...prev, { from: data.from, message: decryptedMsg }]);
        }
      } catch (e) {
        console.error("Invalid message format:", e);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socketRef.current.close();
      setMessages([]);
    };
  }, [currUser, currentUser]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !currentUser) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) return;

    const encrypted = caesarEncrypt(inputMessage.trim(), shift);

    socketRef.current.send(
      JSON.stringify({
        sender: currUser.name,
        recipient: currentUser,
        message: encrypted,
        type: "chat",
      })
    );

    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (loading) return <div className="text-white p-4">Loading users...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading users</div>;

  const filteredUsers =
    currUser?.role === "admin"
      ? data.allUsers.filter((u) => u.name !== currUser.name)
      : data.allUsers.filter((u) => u.role === "admin");

  return (
    <div className="flex h-[90vh] bg-[#121212] font-sans text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#1f1f1f] border-r border-[#333] p-4 overflow-y-auto">
        <h2 className="text-lg mb-2.5 text-gray-400">
          List of {currUser?.role === "admin" ? "Users" : "Admins"}
        </h2>
        <ul className="list-none p-0 m-0">
          {filteredUsers.map((user) => (
            <li
              key={user.name}
              onClick={() => setCurrentUser(user.name)}
              className={`px-2.5 py-2 mb-2 bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#3a3a3a] ${
                currentUser === user.name ? "bg-[#1a73e8] text-white" : ""
              }`}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Chat header */}
        <div className="py-2 border-b border-[#333] text-lg text-gray-400">
          <h2>{currentUser ? `Chatting with ${currentUser}` : "Select a user to chat"}</h2>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] px-4 py-3 rounded-[18px] break-words leading-relaxed ${
                msg.from === currUser.name
                  ? "bg-blue-600 border-2 border-blue-800 text-white self-end"
                  : "bg-[#2a2a2a] border-2 border-[#3a3a3a] text-white self-start"
              }`}
              style={{ animation: "fadeInUp 0.3s ease-in" }}
            >
              <b>{msg.from === currUser.name ? "You" : msg.from}:</b> {msg.message}
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="flex border-t border-[#333] py-3 gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!currentUser}
            className={`flex-1 px-3 py-2 rounded-lg text-white text-base bg-[#2a2a2a] border-none focus:outline-none ${
              !currentUser ? "bg-gray-600" : ""
            }`}
          />
          <button
            onClick={sendMessage}
            disabled={!currentUser}
            className={`px-5 py-2 rounded-lg font-bold text-white ${
              currentUser ? "bg-[#1a73e8] cursor-pointer" : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
