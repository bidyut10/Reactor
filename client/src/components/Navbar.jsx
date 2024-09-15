import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Avatar from "react-avatar";
import { RiCloseLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const Navbar = () => {
  const [data, setData] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    fetch(process.env.REACT_BE_URL + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setData(data.user);
        } else {
          toast.error(data.message || "Failed to fetch user details", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      })
      .catch(() => {
        toast.error("An error occurred while fetching user details", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 3000,
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  // Add onClick to navigate to the home page
  const navigateHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-28 py-4 md:py-0 h-16 relative">
        <h1
          className="text-3xl text-transparent bg-clip-text bg-gradient-to-r to-purple-900 from-purple-400 signature cursor-pointer"
          onClick={navigateHome} // Navigate to home on click
        >
          reactor
        </h1>
        <Avatar
          onClick={toggleDropdown}
          name={data ? data.name : ""}
          size="36"
          round="50%"
          color="#6d28d9" // Purple color
          className="cursor-pointer links flex items-center"
        />

        {dropdownVisible && (
          <div className="absolute right-4 top-16 md:right-28 md:top-20 shadow-lg shadow-black/50 p-4 rounded-lg bg-white w-56 h-40 z-50">
            <RiCloseLine
              onClick={toggleDropdown}
              className="absolute top-4 right-2 cursor-pointer"
              size={20}
            />
            <div className="py-2">
              <h3 className="text-md">{data ? data.name : ""}</h3>
              <p className="text-md text-gray-500">{data ? data.email : ""}</p>
            </div>
            <button
              onClick={logout}
              className="w-full p-2 rounded-lg bg-purple-800 text-white cursor-pointer mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Navbar;
