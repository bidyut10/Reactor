import { useState } from "react";
import { BsCode } from "react-icons/bs";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

const ListCard = ({ item, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);

  const deleteProj = (id) => {
    fetch(`${process.env.REACT_BE_URL}/deleteProject`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progId: id,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsDeleteModelShow(false);
          onDelete(id); // Notify parent component to remove the project
          toast.success("Project deleted successfully", {
            position: "top-right",
            autoClose: 3000, // Auto close the toast after 3 seconds
          });
        } else {
          toast.error(data.message || "Failed to delete project", {
            position: "top-right",
            autoClose: 3000,
          });
          setIsDeleteModelShow(false);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while deleting the project", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error(error);
        setIsDeleteModelShow(false);
      });
  };

  return (
    <>
      <div className="listCard mb-2 w-full flex items-center justify-between p-4 bg-[#141414] bg-opacity-50 cursor-pointer rounded-2xl hover:bg-[#202020] hover:bg-opacity-80">
        <div className="flex items-center gap-6">
          <BsCode className="text-purple-900" size={30} />
          <h3 className="text-xl text-gray-300">{item.title}</h3>
          <p className="text-gray-400 text-sm">
            {new Date(item.date).toDateString()}
          </p>
        </div>
        <div className="flex items-center gap-8">
          <FiEdit
            onClick={() => navigate(`/editor/${item._id}`)}
            className="text-gray-300 cursor-pointer hover:text-gray-200"
            size={22}
          />
          <MdDeleteOutline
            onClick={() => setIsDeleteModelShow(true)}
            className="text-red-500 cursor-pointer hover:text-red-600"
            size={27}
          />
        </div>
      </div>

      {isDeleteModelShow && (
        <div className="model fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] flex justify-center items-center flex-col">
          <div className="w-96 h-fit bg-[#141414] rounded-lg p-[20px]">
            <h3 className="text-2xl text-gray-300">
              Do you want to delete this project?
            </h3>
            <div className="flex w-full mt-5 items-center gap-[10px]">
              <button
                onClick={() => deleteProj(item._id)}
                className="p-[10px] rounded-lg bg-[#FF4343] text-white cursor-pointer min-w-[49%]"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModelShow(false)}
                className="p-[10px] rounded-lg bg-[#1A1919] text-white cursor-pointer min-w-[49%]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ListCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired, // Added prop type for onDelete
};

export default ListCard;
