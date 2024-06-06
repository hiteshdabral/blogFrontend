import { useAuth } from "../context/AuthContext";
import { useState,useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Buffer} from "buffer"
import "./Account.css"

export default function Account() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    (async () => {
      try{
        const response=await axios.get("http://localhost:3333/api/users/profile",{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        })
        setUpdatedData(response.data);
        console.log(response.data)
      }
      catch(err){
        console.log(err)
      }
    })();
  }, []);

  const handleUpdate = () => {
    setShowForm(!showForm);
  };

  let imageUrl = null;
  if (updatedData.profilePicture && updatedData.profilePicture.data) {
    const base64String = Buffer.from(updatedData.profilePicture.data).toString(
      "base64"
    );
    imageUrl = `data:${updatedData.profilePicture.contentType};base64,${base64String}`;
  }

  return (
    <div className="account-page">
      <h2>My Account</h2>
      {user && (
        <>
          {console.log(user)}
          <p>Username: {user.profile.profile.username}</p>
          <p>Email: {user.profile.profile.email}</p>
          {updatedData && <p>Bio: {updatedData.bio}</p>}
          {imageUrl && <img src={imageUrl} alt="Profile" />}
          <br/>
          <button onClick={handleUpdate}>Update Profile</button>
          {showForm && (
            <Formik
              initialValues={{ bio: "", profilePicture: null }}
              validationSchema={Yup.object({
                bio: Yup.string()
                  .min(3, "Must be at least 3 characters")
                  .max(50, "Must be 50 characters or less")
                  .required("Required"),
                profilePicture: Yup.mixed().required(
                  "Profile picture is required"
                ),
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const formData = new FormData();
                  formData.append("bio", values.bio);
                  formData.append("profilePicture", values.profilePicture);
                  console.log(formData);
                  const response = await axios.put(
                    `http://localhost:3333/api/users/profile`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: localStorage.getItem("token"),
                      },
                    }
                  );
                  toast.success("Updated successfully");
                  resetForm();
                  setTimeout(() => {
                    navigate("/posts");
                  }, 1000);
                } catch (error) {
                  console.error(
                    "There was an error submitting the form!",
                    error
                  );
                  toast.error("There was an error submitting the form!");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {(formik) => (
                <Form className="form-container">
                  <div>
                    <label htmlFor="bio">Bio</label>
                    <Field type="text" id="bio" name="bio" />
                    <ErrorMessage
                      name="bio"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div>
                    <label htmlFor="profilePicture">Upload Image</label>
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "profilePicture",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    <ErrorMessage
                      name="profilePicture"
                      component="div"
                      className="error"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Submit
                  </button>
                  <ToastContainer />
                </Form>
              )}
            </Formik>
          )}
        </>
      )}
    </div>
  );
}
