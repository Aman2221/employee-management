"use client";
import CustomLeave from "../Pop-ups/CustomLeave";
import DropDown from "../Common/DropDown";
import InputField from "../Common/InputField";
import data from "@/JSON/data.json";
import React, { useState } from "react";
import { auth, db } from "@/config/firebase";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc } from "firebase/firestore";
import { freshUserInterface } from "@/interfaces";
import {
  ErrorToast,
  SuccessToast,
  addUserToDB,
  checkPassword,
  handleCatchError,
  sendEmail,
  validateEmail,
} from "@/functions";
import { freshUser } from "../../DefaultData";

type DDStatesKeys = "role" | "designation";
type passwords = "password" | "confirm_password";

const RegisterPg = () => {
  const router = useRouter();
  const roleOpt = ["employee", "human resource", "manager"];
  const designationOpt = [
    "business analyst",
    "graphic design",
    "frontend",
    "testing",
  ];

  const [showPass, setShowPass] = useState({
    password: false,
    confirm_password: false,
  });
  const [userData, setUserData] = useState<freshUserInterface>(freshUser);
  const [showCtmLeave, setShowCtmLeave] = useState(false);
  const [ddStates, setDdStates] = useState({
    role: false,
    designation: false,
  });

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    let key = target.name;
    setUserData({
      ...userData,
      [key]: target.value,
    });
  };

  const handleDropDown = (show: boolean, key: string) => {
    setDdStates({
      ...ddStates,
      [key]: show,
    });
  };

  const handleDDChange = (value: string, key?: string) => {
    if (key) {
      setUserData({
        ...userData,
        [key]: value,
      });
      setDdStates({
        ...ddStates,
        [key]: !ddStates[key as DDStatesKeys],
      });
    }
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
        type userType = { uid: string };
        const user: userType = userCredential.user;
        // setUserToLocal("user", user);

        const userDoc = doc(db, "users", user.uid);
        await addUserToDB(userDoc, userData, user.uid); //adding user data to collection

        await sendEmail(
          userData.username,
          userData.password,
          userData.email,
          "Welcome to Primasoft"
        );
        SuccessToast("User Registered Successful");
        setTimeout(() => {
          router.push("/");
        }, 500);
      } catch (error) {
        handleCatchError(error);
      }
    } else {
      ErrorToast(
        !validEmail
          ? "Email is not valid"
          : "Password should include one capital letter, one small letter, one special character, numbers, the length should be atleast 8 characters long and password and confirm password should be the same"
      );
    }
  };

  const handleDefaultLeaves = () => {
    setUserData({
      ...userData,
      leaves: {
        casual: 12,
        sick: 6,
      },
    });
  };

  const handleShowPass = (key: string) => {
    setShowPass({
      ...showPass,
      [key]: !showPass[key as passwords],
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-0 mx-auto">
        <div className="register_form bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Register new user
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div className=" grid grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-5">
                {data.register_fields.map((item) => (
                  <div key={item.label} className="relative">
                    {item.label == "role" || item.label == "designation" ? (
                      <DropDown
                        label={item.label}
                        show={ddStates[item.label]}
                        setShow={() =>
                          handleDropDown(
                            ddStates[item.label as DDStatesKeys],
                            item.label
                          )
                        }
                        options={
                          item.label == "role" ? roleOpt : designationOpt
                        }
                        onChange={handleDDChange}
                        SelectBtnComp={
                          <button
                            type="button"
                            onClick={() =>
                              handleDropDown(
                                !ddStates[item.label as DDStatesKeys],
                                item.label
                              )
                            }
                            className="py-2 capitalize px-4 text-sm font-medium text-gray-200 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex items-center gap-2 w-full justify-between"
                          >
                            <span>{userData[item.label]}</span>
                            <i className="bi bi-caret-down mt-1"></i>
                          </button>
                        }
                      />
                    ) : (
                      <>
                        <InputField
                          name={item.name}
                          placeholder={item.placeholder}
                          type={
                            item.name == "password" && showPass.password
                              ? item.type
                              : item.name == "confirm_password" &&
                                showPass.confirm_password
                              ? item.type
                              : "text"
                          }
                          onChange={handleInputChange}
                          label={
                            item.label == "employee id"
                              ? item.label + "3 digit number"
                              : item.label
                          }
                        />
                        {item.name == "password" ||
                        item.name == "confirm_password" ? (
                          <i
                            onClick={() => handleShowPass(item.name)}
                            className={`bi ${
                              item.name == "password" && showPass.password
                                ? "bi-eye-slash"
                                : item.name == "confirm_password" &&
                                  showPass.confirm_password
                                ? "bi-eye-slash"
                                : "bi-eye"
                            } absolute right-4 top-10 cursor-pointer`}
                          ></i>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </div>
                ))}

                <div>
                  <label
                    htmlFor={"leaves"}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
                  >
                    user leaves
                  </label>
                  <button
                    onClick={handleDefaultLeaves}
                    className="capitalize w-full border border-gray-600 bg-gray-700 text-base rounded-lg
                  py-2"
                    type="button"
                  >
                    set default
                  </button>
                </div>
                <div>
                  <label htmlFor={"leaves"} className="invisible opacity-0">
                    test
                  </label>
                  <button
                    className="capitalize w-full border border-gray-600 bg-gray-700 text-base rounded-lg
                  py-2"
                    type="button"
                    onClick={() => setShowCtmLeave(!showCtmLeave)}
                  >
                    select custom
                  </button>
                </div>
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
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
      {showCtmLeave && (
        <CustomLeave show={showCtmLeave} setShow={setShowCtmLeave} />
      )}
      <ToastContainer />
    </>
  );
};

export default RegisterPg;
