import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState(null); 

  useEffect(() => {
    document.title = "Home - Blog app";
    axios
      .get("http://localhost:5003/getposts")
      .then((response) => {
        setPosts(response.data); 
      })
      .catch((err) => console.log(err));
  }, []); 

  return (
    <div className="container mx-auto p-6">
    <div className="grid grid-cols-1 gap-6">
      {posts &&
        posts.map((post) => (
          <Link
            to={`/post/${post._id}`}
            key={post._id}
            className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
          >
            <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-700">{post.description}</p>
          </Link>
        ))}
    </div>
  </div>
  );
}

export default Home;

