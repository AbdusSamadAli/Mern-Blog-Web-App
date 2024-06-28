import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";

function Navbar() {
  const { user, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
     axios.get("http://localhost:5003/logout")
      .then((res) => {
        if (res.data === "Success") {
          handleLogout();
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Blog App</h1>
      </div>
      <div className="flex space-x-4 mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>
        <Link to="/create-blog" className="text-blue-500 hover:underline">
          Create Blog
        </Link>
      </div>
      {user ? (
        <div>
          <input
            type="button"
            value="Logout"
            onClick={logout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
          />
        </div>
      ) : (
        <div>
          <h2 className="bg-green-400 p-2 rounded">
            <Link to="/register" className="link">
              Register/Login
            </Link>
          </h2>
        </div>
      )}
    </div>
  );
}

export default Navbar;
