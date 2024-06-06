import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import axios from "axios";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Buffer} from "buffer"
import './Posts.css'
export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3333/api/posts");
        setPosts(response.data);
     
      } catch (err) {
        alert(err);
      }
    })();
  }, []);


 
  const decodeImage = (image) => {
    if (image && image.data) {
      const base64String = Buffer.from(image.data).toString("base64");
      return `data:${image.contentType};base64,${base64String}`;
    }
    return null;
  };

  return (
    <>
      <h2>Listing Posts -{posts.length}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px"}}>
      {posts.map((post) => (
        <Card key={post._id} style={{outline: "solid" }} className="card">
         
            <CardMedia
              component="img"
              alt={post.title}
              style={{ width: "300px", height: "200px" }}
              image={decodeImage(post.featuredImage)}
            />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" component={Link} to={`/single-post/${post._id}`}>
              Learn More
            </Button>
          </CardActions>
        </Card>
      ))}
      </div>
    </>
  );
}
