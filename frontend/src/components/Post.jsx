import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
    .get(`http://localhost:5003/getpostbyid/${id}`)
      .then((result) => setPost(result.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!post) {
    return <div>Loading...</div>; 
  }

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5003/deletepost/${id}`)
      .then((result) => {
        navigate("/"); 
      })
      .catch((err) => console.log(err));
  };

  return (
      <div className="max-w-4xl mx-auto p-6">
       <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4">{post.description}</p>
        </div>
        <div className="flex mt-4">
          <Link
            to={`/editpost/${post._id}`} 
            className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded mr-2 transition duration-200"
          >
            Edit
          </Link>
          <button
              onClick={() => handleDelete(post._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
            >
              Delete
            </button>
        </div>
      </div>
  );
}

export default Post;
