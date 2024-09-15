import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Simple email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 16;
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validatePassword(pwd)) {
      toast.error("Password must be between 8 and 16 characters long");
      return;
    }

    fetch(process.env.REACT_BE_URL + "/signUp", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: pwd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          toast.success("Account created successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
  };

  return (
    <div className="relative w-screen min-h-screen flex items-center justify-center px-4 lg:px-0">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1619682508024-64c66726a373?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      ></div>

      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl">
        {/* Left Side - Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <h1 className="text-5xl uppercase lg:text-6xl xl:text-7xl italiana text-purple-950 text-opacity-60 px-10 font-bold mb-4">
            Reactor
          </h1>
          <h1 className="text-3xl text-purple-700 text-opacity-30 px-10 mb-4">
            Your Ultimate Online Code Editor
          </h1>
          <p className="text-base lg:text-lg xl:text-xl text-gray-300 text-opacity-70 p-10 leading-relaxed mb-8 railway">
            With Reactor, effortlessly write, preview, and refine your React
            components, enhanced with the power of Tailwind CSS.
            <br />
            No setups, no hassle — just your creativity at its best. Ready to
            unlock new possibilities?
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="w-full lg:w-[40%] bg-black bg-opacity-50 p-6 lg:p-8 rounded-3xl shadow-lg">
          <form onSubmit={submitForm} className="w-full">
            <div className="flex justify-center mb-6">
              <h2 className="text-white text-2xl railway">
                Join Reactor Today
              </h2>
            </div>
            <div className="inputBox mb-6">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full name"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="inputBox mb-6">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Your email address"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="inputBox mb-6">
              <input
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                type="password"
                placeholder="Create a password"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <p className="text-white text-sm mb-4 railway">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 underline">
                Log in here
              </Link>
            </p>

            <button
              type="submit"
              className="w-full p-3 bg-purple-800 text-white font-semibold rounded-lg hover:bg-purple-950 railway transition-all"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
