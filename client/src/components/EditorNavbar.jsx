/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { FiDownload } from "react-icons/fi";
import { AiOutlineSave } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const EditorNavbar = ({ title, onDownload, onSave }) => {

  const navigate = useNavigate(); // Initialize navigate hook

  const handleSave = () => {
    try {
      onSave();
    } catch (error) {
      toast.error("Error saving the file.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDownload = () => {
    try {
      onDownload(); // Trigger download functionality
      toast.success("File downloaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error downloading the file.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  // Add onClick to navigate to the home page
  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-[30px] h-[70px] bg-[#000000]">
      <h1
        className="text-3xl text-transparent bg-clip-text bg-gradient-to-r to-purple-900 from-purple-400 signature cursor-pointer"
        onClick={navigateHome}
      >
        reactor
      </h1>
      <p className="text-gray-300">
        File / <span className="text-gray-400">{title}</span>
      </p>
      <div className="actions flex gap-4 ">
        <i
          className="p-[8px] btn  rounded-[5px] cursor-pointer text-[20px]"
          onClick={handleDownload}
        >
          <FiDownload className="text-gray-100" />
        </i>
        <i
          className="p-[8px] btn rounded-[5px] cursor-pointer text-[20px]"
          onClick={handleSave}
        >
          <AiOutlineSave className="text-gray-100" />
        </i>
      </div>
    </div>
  );
};

EditorNavbar.propTypes = {
  title: PropTypes.string.isRequired,
  onDownload: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditorNavbar;
