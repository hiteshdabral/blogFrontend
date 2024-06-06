import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./MyPosts.css";
import EditImg from "../images/icons8-edit-48.png"
import deleteImg from "../images/icons8-delete-30.png"
import "./MyPosts.css";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:3333/api/posts/myposts",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3333/api/posts/${postId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="container">
      {posts.length === 0 ? (
        <h2>No Posts Found</h2>
      ) : (
        <div>
          <h2>Listing My Posts - {posts.length}</h2>
          <ul>
            {posts.map((ele) => (
              <li key={ele._id} className="post-item">
                <Link to={`/single-post/${ele._id}`}>{ele.title}</Link>
                <span>

                <Link to={`/update-post/${ele._id}`}>
                  <img src={EditImg}  alt="Edit" />
                </Link>
                <img
                  src={deleteImg}
                  onClick={() => {
                    handleDelete(ele._id);
                  }}
                  className="delete-img"
                  alt="Delete"
                />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link to={"/new-post"}>
        <button className="add-post-button">Add new Post</button>
      </Link>
    </div>
  );
}