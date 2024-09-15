import { useEffect, useRef, useState } from "react";
import { AiOutlineSend, AiOutlineLoading } from "react-icons/ai"; // Add loading icon
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure this is installed

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { type: "response", text: "Hello! How can I assist you today?" },
  ]);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const chatBoxRef = useRef(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedChat = JSON.parse(localStorage.getItem("chatHistory"));
    if (savedChat) {
      setChat(savedChat);
    }
  }, []);

  // Save chat history to localStorage whenever chat updates
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chat));
  }, [chat]);

  // Close the chatbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = async () => {
    if (message.trim()) {
      // Add the user's message
      setChat((prevChat) => [...prevChat, { type: "request", text: message }]);

      // Show loading and disable send button
      setIsLoading(true);

      // Generate response using Google Generative AI (Gemini)
      const response = await generateResponse(message);

      // Add the AI's response
      setChat((prevChat) => [
        ...prevChat,
        { type: "response", text: cleanResponse(response) },
      ]);

      setMessage(""); // Clear the input field
      setIsLoading(false); // Stop loading after receiving response
    }
  };

  const generateResponse = async (msg) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_API_KEY);
      const model = genAI.getGenerativeModel({ model: process.env.REACT_API_MODEL });
      const result = await model.generateContent(msg);

      return result.response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      return "Sorry, I couldn't process that request.";
    }
  };

  const cleanResponse = (text) => {
    return text.replace(/\*/g, ""); // Removes all instances of '**'
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatBoxRef}
      className="fixed bottom-0 right-0 m-4 px-4 py-8 bg-white border rounded-lg shadow-lg w-[400px] h-[600px] max-w-full max-h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-3 border-b">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`my-2 py-3 px-4 ${
                msg.type === "response"
                  ? "bg-gray-50 text-gray-700 mr-16 self-start rounded-t-2xl rounded-r-2xl"
                  : "bg-purple-400 text-gray-900 ml-16 self-end rounded-t-2xl rounded-l-2xl"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex items-center p-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
            placeholder="Type your message..."
            disabled={isLoading} // Disable input while loading
          />
          <button
            onClick={handleSend}
            className={`ml-2 p-2 text-xl bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`} // Disable the button while loading
            disabled={isLoading}
          >
            {isLoading ? (
              <AiOutlineLoading className="animate-spin" /> // Show loading spinner
            ) : (
              <AiOutlineSend />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
