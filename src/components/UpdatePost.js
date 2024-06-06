import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdatePost.css"


const NewPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    featuredImage: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const response = await axios.get(`http://localhost:3333/api/posts/${id}`);
          setFormData({
            title: response.data.title,
            content: response.data.content,
            tags: response.data.tags,
            featuredImage: null,
          });
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      featuredImage: e.target.files[0],
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
    };
  
    if (formData.featuredImage) {
      formDataToSend.featuredImage = formData.featuredImage;
    }
  
    try {
      if (id) {
        const result = await axios.put(
          `http://localhost:3333/api/posts/${id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log(result);
        toast.success("Post updated successfully");
      } else {
        const result = await axios.post(
          "http://localhost:3333/api/posts",
          formDataToSend,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log(result);
        toast.success("Post created successfully");
      }
  
      setTimeout(() => {
        navigate("/posts");
      }, 1000);
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      toast.error("There was an error submitting the form!");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="tags">Tags</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="featuredImage">Upload Image</label>
        <input
          type="file"
          id="featuredImage"
          name="featuredImage"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <ReactQuill
          id="content"
          name="content"
          value={formData.content}
          onChange={handleContentChange}
        />
      </div>
      <button type="submit">Submit</button>
      <ToastContainer />
    </form>
  );
};

export default NewPost;
