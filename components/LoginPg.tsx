"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import {
  ErrorToast,
  SuccessToast,
  encryptData,
  getUserDoc,
  setCookie,
  setItemToLocal,
} from "@/functions";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginPg = () => {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [userData, setUserData] = useState({
    // email: "aman@primasoft.ae",
    // password: "Aman@123",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    let target: any = e.target;
    let key = target.name;
    setUserData({
      ...userData,
      [key]: target.value,
    });
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // let validEmail = validateEmail(userData.email);
    // if (validEmail) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const user: any = userCredential.user;
      const encryptToken = encryptData(user.accessToken, user.uid);
      // setUserToLocal("user", user);
      setCookie("token", encryptToken, 7);
      setItemToLocal("uid", user.uid);
      await getUserDoc(user.uid);
      SuccessToast("Login Successful");
      setTimeout(() => {
        router.push("/home");
      }, 500);
    } catch (error) {
      ErrorToast("Please enter valid email and password");
    }
    // } else {
    //   ErrorToast("Email is not valid");
    // }
  };

  //if want to access login page even after login just remove this code
  // useEffect(() => {
  //   deleteAllCookies();
  // });

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <Image
            width={50}
            height={100}
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Primasoft
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                  value={userData.email}
                  className=" outline-none border bg-transparent border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="john@primasofttechnology.com"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                  value={userData.password}
                  className="bg-transparent border outline-none border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <i
                  onClick={() => setShowPass(!showPass)}
                  className={`bi ${
                    showPass ? "bi-eye-slash" : "bi-eye"
                  } absolute right-4 top-10 cursor-pointer`}
                ></i>
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
    </section>
  );
};

export default LoginPg;
