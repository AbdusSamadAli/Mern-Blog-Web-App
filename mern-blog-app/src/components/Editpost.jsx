import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by error boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Something went wrong.</div>;
    }

    return this.props.children; 
  }
}

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:5003/getpostbyid/${id}`)
      .then((result) => {
        const post = result.data;
        setTitle(post.title);
        setDescription(post.description);
      })
      .catch((err) => console.log(err));
  }, [id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5003/editpost/${id}`, { title, description })
      .then((res) => {
        if (res.data === "Success") {
          navigate(`/post/${id}`);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <ErrorBoundary>
   <div className="mt-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="post_form">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Update Post</h2>
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="desc"
              id="desc"
              cols="30"
              rows="10"
              value={description}
              placeholder="Enter Description"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default EditPost;
