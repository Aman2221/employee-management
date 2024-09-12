"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import {
  ErrorToast,
  SuccessToast,
  addUserToDB,
  checkPassword,
  deleteAllCookies,
  validateEmail,
} from "@/functions";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "./common/InputField";
import data from "@/JSON/data.json";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc } from "firebase/firestore";

const RegisterPg = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    emp_id: "",
    phone: "",
    role: "",
    email: "",
    password: "",
    confirm_password: "",
    designation: "",
  });

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    let target: any = e.target;
    let key = target.name;
    setUserData({
      ...userData,
      [key]: target.value,
    });
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let validEmail = validateEmail(userData.email);
    let validPassword = checkPassword(
      userData.password,
      userData.confirm_password
    );

    if (validEmail && validPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        const user: any = userCredential.user;
        // setUserToLocal("user", user);

        const userDoc = doc(db, "users", user.uid);
        await addUserToDB(userDoc, userData, user.uid); //adding user data to collection
        SuccessToast("User Registered Successful");
        setTimeout(() => {
          router.push("/");
        }, 500);
      } catch (error) {
        ErrorToast("");
      }
    } else {
      ErrorToast(
        !validEmail
          ? "Email is not valid"
          : "Password should include one capital letter, one small letter, one special character, numbers, the length should be atleast 8 characters long and password and confirm password should be the same"
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Primasoft
        </div>
        <div className="register_form bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Register new user
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div className=" grid grid-cols-2 gap-x-10 gap-y-5">
                {data.register_fields.map((item) => (
                  <div key={item.label} className="relative">
                    <InputField
                      name={item.name}
                      placeholder={item.placeholder}
                      type={
                        item.name == "password" ||
                        item.name == "confirm_password"
                          ? showPass
                            ? "text"
                            : item.type
                          : item.type
                      }
                      onChange={handleInputChange}
                      label={item.label}
                      extrClasses="w-52"
                    />
                    {item.name == "password" ||
                    item.name == "confirm_password" ? (
                      <i
                        onClick={() => setShowPass(!showPass)}
                        className={`bi ${
                          showPass ? "bi-eye-slash" : "bi-eye"
                        } absolute right-4 top-10 cursor-pointer`}
                      ></i>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default RegisterPg;
