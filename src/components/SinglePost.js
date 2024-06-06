import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Buffer } from "buffer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import he from "he"; // Import the HTML entities library
import "./SinglePost.css"


export default function Post() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`http://localhost:3333/api/posts/${id}`);
        // Decode HTML entities in post title and content
        const decodedPost = {
          ...response.data,
          title: he.decode(response.data.title),
          content: he.decode(response.data.content)
        };
        setPost(decodedPost);

        const postId = response.data._id;
        console.log(postId);

        const commentsResponse = await axios.get(`http://localhost:3333/api/posts/${postId}/comments`);
        // Decode HTML entities in comment content using he library
        const decodedComments = commentsResponse.data.map(comment => ({
          ...comment,
          content: he.decode(comment.content)
        }));
        setComments(decodedComments);
        console.log(decodedComments);
      } catch (err) {
        alert(err);
      }
    })();
  }, [id]);

  const handleAddComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3333/api/posts/${id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // Assuming response.data contains the new comment with author details
      setComments([...comments, response.data]);
      setNewComment(""); // Clear the comment input field
      alert("Comment added successfully!");
    } catch (err) {
      console.error("There was an error adding the comment!", err);
      alert(err);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  // Decode the image
  let imageUrl = null;
  if (post.featuredImage && post.featuredImage.data) {
    const base64String = Buffer.from(post.featuredImage.data).toString("base64");
    imageUrl = `data:${post.featuredImage.contentType};base64,${base64String}`;
  }

  return (
    <div className="Post">
      <h2>{post.title}</h2>
      <h2 dangerouslySetInnerHTML={{ __html: post.content }} />
      {imageUrl && <img src={imageUrl} alt="Featured" />}
      <div>
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id}>
              <p dangerouslySetInnerHTML={{ __html: comment.content }} /> - From - {comment.author?.username}
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
      <h2>Add Comment</h2>
      <ReactQuill value={newComment} onChange={setNewComment} />
      <button onClick={handleAddComment} className="submit">Submit</button>
    </div>
  );
}
