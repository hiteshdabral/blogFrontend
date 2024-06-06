import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css"


const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="Register">
      <h1>Registration Form</h1>
      <Formik
        initialValues={{ username: "", email: "", passwordHash: "" }}
        validationSchema={Yup.object({
          username: Yup.string()
            .min(3, "Must be at least 3 characters")
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          passwordHash: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          axios
            .post("http://localhost:3333/api/users/register", values)
            .then((response) => {
              console.log(response.data);
              toast.success("Registration completed");
              resetForm();
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            })
            .catch((error) => {
              console.error("There was an error submitting the form!", error);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {(formik) => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
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
};

export default Register;
