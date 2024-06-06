import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Register from './components/Register';
import Login from "./components/Login"
import Account from './components/Account';
import { useAuth } from './context/AuthContext';
import axios from "axios"
import Posts from './components/Posts';
import SinglePost from './components/SinglePost';
import MyPosts from './components/MyPosts';
import NewPost from './components/NewPost';
import UpdatePost from "./components/UpdatePost"
import "./App.css"

function App() {
  const { user, dispatch } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        try {
          const response = await axios.get('http://localhost:3333/api/users/profile', {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          });
          dispatch({ type: "LOGIN", payload: { profile: response.data } });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          navigate('/login'); 
        }
      })();
    }
  }, [dispatch, navigate]); 

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">
          <h2>Blog Site</h2>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {!user.isLoggedIn ? (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Link to="/my-posts">My Posts</Link>
              </li>
              <li>
                <Link
                  to={'/'}
                  onClick={() => {
                    localStorage.removeItem('token');
                    dispatch({ type: 'LOGOUT' });
                    navigate('/login');
                  }}
                >
                  LOGOUT
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/account' element={<Account />} />
        <Route path='/posts' element={<Posts />} />
        <Route path='/single-post/:id' element={<SinglePost />} />
        <Route path='/my-posts' element={<MyPosts />} />
        <Route path='/new-post' element={<NewPost />} />
        <Route path='/update-post/:id' element={<UpdatePost />} />
      </Routes>
    </div>
  );
}

export default App;
