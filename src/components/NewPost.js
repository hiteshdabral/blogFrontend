import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NewPost.css"

const NewPost = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null); 

  return (
    <div className="NewPost">

    <Formik
      initialValues={{ title: "", content: "", tags: "", image: null }}
      validationSchema={Yup.object({
        title: Yup.string()
          .min(3, "Must be at least 3 characters")
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        content: Yup.string()
          .min(3, "Must be at least 3 characters")
          .max(1000, "Must be 1000 characters or less")
          .required("Required"),
        tags: Yup.string().required("Tags are required"),
        featuredImage: Yup.mixed().required("featuredImage is required"),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("content", values.content);
          formData.append("tags", values.tags);
          formData.append("featuredImage", values.featuredImage);

          const response = await axios.post(
            "http://localhost:3333/api/posts",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: localStorage.getItem("token"),
              },
            }
          );

          console.log(response.data);
            toast.success(" Post created successfully");
          resetForm();
          setTimeout(() => {
      navigate("/posts");
    }, 1000); 
        } catch (error) {
          console.error("There was an error submitting the form!", error);
          toast.error("There was an error submitting the form!");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(formik) => (
        <Form>
          <div>
            <label htmlFor="title">Title</label>
            <Field type="text" id="title" name="title" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="tags">Tags</label>
            <Field type="text" id="tags" name="tags" />
            <ErrorMessage name="tags" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="featuredImage">Upload Image</label>
            <input
              type="file"
              id="featuredImage"
              name="featuredImage"
              accept="image/*"
              onChange={(event) => {
                setImage(event.currentTarget.files[0]);
                formik.setFieldValue(
                  "featuredImage",
                  event.currentTarget.files[0]
                );
              }}
            />
            <ErrorMessage
              name="featuredImage"
              component="div"
              className="error"
            />
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <ReactQuill
              id="content"
              name="content"
              value={formik.values.content}
              onChange={(value) => formik.setFieldValue("content", value)}
            />
            <ErrorMessage name="content" component="div" className="error" />
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
    </div>
  );
};

export default NewPost;
