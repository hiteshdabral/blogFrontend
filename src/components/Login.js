import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  return (
    <div className="Login">

    <Formik
      initialValues={{ email: "", passwordHash: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        passwordHash: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Required"),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const response = await axios.post(
            "http://localhost:3333/api/users/login",
            values
          );
          // console.log(response.data);
          localStorage.setItem("token", response.data.token);
          const profileResponse = await axios.get(
            "http://localhost:3333/api/users/profile",
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          console.log(profileResponse.data);
          dispatch({
            type: "LOGIN",
            payload: { profile: profileResponse.data },
          });
          resetForm();
          toast.success("Login successfully");
          setTimeout(() => {
            navigate("/posts");
          }, 1000);
        } catch (error) {
          console.error("There was an error submitting the form!", error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(formik) => (
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="passwordHash">Password</label>
            <Field type="password" id="passwordHash" name="passwordHash" />
            <ErrorMessage
              name="passwordHash"
              component="div"
              className="error"
            />
          </div>
          <button type="submit" disabled={formik.isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
    </div>
  );
}
