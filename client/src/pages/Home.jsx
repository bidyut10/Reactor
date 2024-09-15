import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ListCard from "../components/ListCard";
import { useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projTitle, setProjTitle] = useState("");
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const navigate = useNavigate();

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createProj = async () => {
    if (projTitle === "") {
      toast.error("Please Enter Project Title", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_BE_URL}/createProject`,
        {
          title: projTitle,
          userId: localStorage.getItem("userId"),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setIsCreateModelShow(false);
        setProjTitle("");
        toast.success("Project Created Successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate(`/editor/${response.data.projectId}`);
      } else {
        toast.error("Something Went Wrong", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating the project", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getProj = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_BE_URL}/getProjects`,
        {
          userId: localStorage.getItem("userId"),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setData(response.data.projects);
      } else {
        toast.error(response.data.message || "Failed to fetch projects", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching projects", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getProj();
  }, []);

  const handleProjectDelete = (id) => {
    setData((prevData) => prevData.filter((project) => project._id !== id));
  };

  return (
    <>
      <Navbar />
      <div
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1619682508024-64c66726a373?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div className="absolute inset-0 filter backdrop-blur-md bg-[#00000070]"></div>
        <div className="relative z-10 flex justify-between items-center px-4 md:px-28 pt-20 mb-10">
          {/* Search Bar */}
          <div className="inputBox w-72 md:w-96 flex items-center px-4 md:px-8 rounded-full bg-white bg-opacity-10">
            <FiSearch className="text-purple-500 mr-2" />
            <input
              type="text"
              placeholder="Search Here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />
          </div>
          <button
            onClick={() => setIsCreateModelShow(true)}
            className="text-white"
          >
            <CiCirclePlus className="pr-2" size={40} />
          </button>
        </div>

        {/* Project Display */}
        <div className="relative z-10 px-4 md:px-28">
          <div className="list">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <ListCard
                  key={item._id}
                  item={item}
                  onDelete={handleProjectDelete}
                />
              ))
            ) : (
              <p className="text-2xl text-gray-300">No projects found</p>
            )}
          </div>
        </div>
      </div>
      {/* Modal for Creating a New Project */}
      {isCreateModelShow && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
          <div className="w-96 h-fit shadow-lg shadow-black/50 bg-[#141414] rounded-[10px] p-[20px]">
            <h3 className="text-2xl text-gray-300 mb-8">Create New Project</h3>
            <div className="inputBox !bg-[#202020] mt-4 mb-8">
              <input
                onChange={(e) => setProjTitle(e.target.value)}
                value={projTitle}
                type="text"
                placeholder="Project Title"
              />
            </div>
            <div className="flex items-center gap-[10px] w-full mt-2">
              <button
                onClick={createProj}
                className="btnBlue rounded-[5px] w-[49%] mb-4 !p-[5px] !px-[10px] !py-[10px]"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreateModelShow(false)}
                className="btnBlue !bg-[#1A1919] rounded-[5px] mb-4 w-[49%] !p-[5px] !px-[10px] !py-[10px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <ToastContainer />
    </>
  );
};

export default Home;
