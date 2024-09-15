import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1619682508024-64c66726a373?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* 404 Content */}
      <div className="relative z-10 text-white">
        <h1 className="text-6xl font-bold mb-4 italiana">404</h1>
        <p className="text-lg mb-8 railway">
          Oops! The page you{"'"}re looking for doesn{"'"}t exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 text-xl bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NoPage;
