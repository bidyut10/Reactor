import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import EditorNavbar from "../components/EditorNavbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import ChatBox from "../components/ChatBox";
import { IoChatbubbleOutline } from "react-icons/io5";
import "../App.css";
const CodeEditor = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  const [reactCode, setReactCode] = useState(``);
  const [title, setTitle] = useState("");
  const { projectID } = useParams(); // Extract projectID from URL
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Fetch project data and set reactCode
  const getProject = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_BE_URL}/getProject/${projectID}`
      ); // Use projectID in the API call
      if (result.data.success) {
        setReactCode(result.data.project.componentCode);
        setTitle(result.data.project.title);
      } else {
        toast.error("Failed to fetch project data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching project data", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getProject();
  }, [projectID]);

  useEffect(() => {
    const iframe = document.getElementById("iframe");
    const iframeDocument = iframe.contentDocument;

    iframeDocument.open();
    iframeDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${reactCode}
          </script>
        </body>
      </html>
    `);
    iframeDocument.close();
  }, [reactCode]);

  const changeTheme = () => {
    setIsLightMode(true);
  };

  const changeDarkTheme = () => {
    setIsLightMode(false);
  };

  const downloadFile = () => {
    const blob = new Blob([reactCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MyComponent.jsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveCode = async () => {
    try {
      await axios.post(`${process.env.REACT_BE_URL}/saveProject/${projectID}`, {
        componentCode: reactCode,
      });
      toast.success("Code saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save code.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <EditorNavbar title={title} onDownload={downloadFile} onSave={saveCode} />
      <ToastContainer /> {/* Add ToastContainer to handle notifications */}
      <div className="flex flex-col md:flex-row">
        {" "}
        {/* Mobile first layout */}
        <div className="w-full md:w-1/2">
          <div className="tabs flex items-center justify-between gap-2 w-full bg-[#1A1919] h-[50px] px-[30px]">
            <div className="tabs flex items-center gap-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isLightMode && (
                <i
                  className="text-[20px] cursor-pointer text-white"
                  onClick={changeTheme}
                >
                  <MdLightMode />
                </i>
              )}
              {isLightMode && (
                <i
                  className="text-[20px] cursor-pointer text-white"
                  onClick={changeDarkTheme}
                >
                  <MdDarkMode />
                </i>
              )}
            </div>
          </div>
          <Editor
            height="100vh"
            theme={isLightMode ? "vs-light" : "vs-dark"}
            language="javascript"
            value={reactCode}
            onChange={(value) => setReactCode(value)}
          />
        </div>
        <iframe
          id="iframe"
          className="w-full md:w-1/2 min-h-[100vh] bg-[#fff] text-black"
          title="output"
        />
        <button className="fixed bottom-12 right-12 p-2 bg-gradient-to-b from-purple-500 to-purple-950 text-white rounded-full shadow-[0_10px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_18px_rgba(0,0,0,0.35)]">
          <IoChatbubbleOutline
            size={30}
            className=""
            onClick={() => setIsChatOpen((prev) => !prev)}
          />
        </button>
        {isChatOpen && <ChatBox />}
      </div>
    </>
  );
};

export default CodeEditor;
