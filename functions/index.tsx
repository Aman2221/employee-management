import { permissions } from "@/interfaces";
import * as XLSX from "xlsx";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Bounce, toast } from "react-toastify";
import cookie from "cookie";
import CryptoJS from "crypto-js";
import moment from "moment";

export const removeKeyFromArray = (arr: any, key: keyof permissions) => {
  return arr.map((item: permissions) => {
    const { [key]: _, ...rest } = item; // Destructure to remove the key
    return rest;
  });
};

export const exportToExcel = (jsonData: any) => {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate Excel file and download
  XLSX.writeFile(workbook, "EmployeeData.xlsx");
};

export const getData = async () => {
  const tempData: any = [];
  try {
    const q = query(
      collection(db, "permissions"),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((doc) =>
      tempData.push({
        id: doc.id,
        ...doc.data(),
      })
    );
    return tempData;
  } catch (e) {
    console.error("Error fetching sorted documents: ", e);
    return [];
  }
};

export const validateEmail = (email: string) => {
  const domain1 = "@primasofttechnology.com";
  const domain2 = "@theswipewire.com";

  const checkDomain = email.endsWith(domain1) || email.endsWith(domain2);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // console.log("email :", emailPattern.test(email), checkDomain);
  if (emailPattern.test(email) && checkDomain) {
    return true;
  }
  return false;
};

export const checkPassword = (password: string, confirm_password: string) => {
  const checkPasswordCompxity = isPasswordComplex(password);
  console.log(
    "checkPassword",
    password === confirm_password,
    password,
    confirm_password,
    "isPasswordComplex :",
    isPasswordComplex(password)
  );
  if (password === confirm_password && checkPasswordCompxity) {
    return true;
  }
  return false;
};

export function isPasswordComplex(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// export async function checkIfSuperUser() {
//   const auth = getAuth(); // Initialize Firebase Auth
//   const user = auth.currentUser; // Get the current user

//   if (user) {
//     try {
//       // Get ID token result, which includes custom claims
//       const idTokenResult = await user.getIdTokenResult();
//       console.log("idTokenResult :", idTokenResult);
//       console.log("claims :", idTokenResult.claims);
//       console.log(
//         "idTokenResult.claims.superUser :",
//         idTokenResult.claims.superUser
//       );
//       console.log(
//         "idTokenResult.claims.superUser :",
//         idTokenResult.claims.superUser
//       );
//       // Check if the custom claim 'superUser' is present
//       if (idTokenResult.claims.superUser) {
//         console.log("User is a super user");
//       } else {
//         console.log("User is not a super user");
//       }
//     } catch (error) {
//       console.error("Error getting ID token result:", error);
//     }
//   } else return false;
// }

//get and set cookie on the client side
export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

export function getCookie(name: string): string | null {
  if (typeof document !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const encryptedCookie = parts.pop().split(";").shift();
      const user_uid = getItemFromLocal("uid");
      const decryptedCookie = decryptData(encryptedCookie, user_uid);
      return decryptedCookie;
    }
  }
  return null;
}

// export function getCookie(name: string): string | null {
//   if (document) {
//     const value = document ? `; ${document.cookie}` : "";
//     const parts: any = value.split(`; ${name}=`);
//     if (value && parts.length === 2) {
//       const encryptedCookie = parts.pop().split(";").shift();
//       const user_uid = getItemFromLocal("uid");
//       const decryptedCookie = decryptData(encryptedCookie, user_uid);
//       return decryptedCookie;
//     }
//     return null;
//   }
//   return null;
// }

//get cookie from the server
// export async function getServerCookie(request: Request) {
//   const allCookies = cookies();
//   const token = allCookies.get("token")?.value;

//   return new Response(`Token: ${token}`);
// }

export const setCookieOnServer = async (token: string) => {
  const response = await fetch("/api/set-cookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
};

export const SuccessToast = (
  text: string = "Successful",
  autoClose: number = 3000,
  hideProgressBar: boolean = false,
  theme: string = "dark"
) => {
  toast.success(text, {
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: hideProgressBar,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme,
    transition: Bounce,
  });
};

export const WarningToast = (
  text: string = "Successful",
  autoClose: number = 3000,
  hideProgressBar: boolean = false,
  theme: string = "dark"
) => {
  toast.warning(text, {
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: hideProgressBar,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme,
    transition: Bounce,
  });
};

export const ErrorToast = (
  text: string = "Successful",
  autoClose: number = 3000,
  hideProgressBar: boolean = false,
  theme: string = "dark"
) => {
  toast.error(text, {
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: hideProgressBar,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme,
    transition: Bounce,
  });
};

export const setItemToLocal = (name: string = "user", value: any) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const getItemFromLocal = (name: string = "user") => {
  const getUser: any = localStorage.getItem(name);
  return JSON.parse(getUser);
};

export const setItemToSession = (name: string = "user", value: any) => {
  sessionStorage.setItem(name, JSON.stringify(value));
};

export const getItemFromSession = () => {
  const getUser: any = sessionStorage.getItem("user");
  return JSON.parse(getUser);
};

export const addUserToDB = async (
  userDoc: any,
  userData: { [key: string]: string },
  uid: string
) => {
  await setDoc(userDoc, {
    ...userData,
    uid: uid,
    createdAt: new Date(),
  });
};

export const getUserDoc = async (docId: string) => {
  try {
    const userDocRef = doc(db, "users", docId);
    const userDocSnap: any = await getDoc(userDocRef);

    const { password, confirm_password, ...userData } = userDocSnap.data();

    const encryptUser = encryptData(JSON.stringify(userData), docId);
    setCookie("user", encryptUser, 1);
  } catch (error) {
    console.error("Error fetching user document: ", error);
    throw error;
  }
};

export const deleteAllCookies = (req?: any, res?: any) => {
  // Client-side deletion
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }

  // Server-side deletion
  if (res && req) {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

    for (const name in cookies) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize(name, "", {
          maxAge: -1,
          path: "/",
        })
      );
    }
  }
};

export const dynamic_column_def = (
  StatusRenderer: (a: any, b: any) => void,
  CellStatusRenderer: (a: any) => void,
  db_data: any,
  openStatusUpdateModal: (a: string, b: string) => void
) => {
  const getUser = getCookie("user");
  const user = JSON.parse(getUser as string);
  if (user) {
    const user_role = user?.role?.toLowerCase();
    return user_role == "hr" || user_role == "manager"
      ? [
          {
            headerName: "Action",
            field: "action",
            cellRenderer: StatusRenderer,
            cellRendererParams: {
              data: db_data,
              openStatusUpdateModal: openStatusUpdateModal,
            },
            cellClass: "flex-center",
            sortable: false,
            filter: false,
            headerClass: "uppercase",
            width: 150,
          },
          {
            headerName: "status",
            field: "status",
            headerClass: "uppercase",
            sortable: true,
            width: 140,
            cellRenderer: CellStatusRenderer,
            cellRendererParams: (params: any) => {
              params: params;
            },
          },
        ]
      : [
          {
            headerName: "status",
            field: "status",
            headerClass: "uppercase",
            sortable: true,
            width: 140,
            cellRenderer: CellStatusRenderer,
            cellRendererParams: (params: any) => {
              params: params;
            },
          },
        ];
  }

  return "";
};

export const updateSatatusAccordingDB = (status: string) => {
  if (status == "approve") return "approved";
  else if (status == "reject") return "rejected";
  else return status;
};

export const updateSatatusAccordingLocal = (status: string) => {
  if (status == "approved") return "approve";
  else if (status == "rejected") return "reject";
  else return status;
};

export const updatePermissionStatusInDB = async (
  docId: string,
  newStatus: string
) => {
  try {
    // Reference to the specific document by ID
    const docRef = doc(db, "permissions", docId);

    // Update the status field in the document
    await updateDoc(docRef, { status: newStatus });

    // SuccessToast("Status updated!");
    // Optionally, return true if the update was successful
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
};

// Encrypt data
export const encryptData = (data: any, secretKey: string) => {
  const hashAndSalt = data + process.env.NEXT_PUBLIC_HASH_SALT;
  return CryptoJS.AES.encrypt(hashAndSalt, secretKey).toString();
};

// Decrypt data
export const decryptData = (cipherText: string, secretKey: string) => {
  if (cipherText && secretKey) {
    const hashWithoutSalt = cipherText.replace(
      process.env.NEXT_PUBLIC_HASH_SALT as string,
      ""
    );
    const bytes = CryptoJS.AES.decrypt(hashWithoutSalt, secretKey);
    // console.log(
    //   "bytes.toString(CryptoJS.enc.Utf8) :",
    //   JSON.parse(
    //     bytes
    //       .toString(CryptoJS.enc.Utf8)
    //       .replace(process.env.NEXT_PUBLIC_HASH_SALT as string, "")
    //   )
    // );
    return bytes
      .toString(CryptoJS.enc.Utf8)
      .replace(process.env.NEXT_PUBLIC_HASH_SALT as string, "");
  } else return "";
};

export const setDataToState = (
  tempData: any,
  setShowLoader: (a: boolean) => void,
  setUpdatesData: (a: any) => void
) => {
  setTimeout(() => {
    if (tempData.length) {
      setUpdatesData({
        headings: Object.keys(tempData[0]) as string[],
        db_data: tempData,
      });
    }
    setShowLoader(false);
  }, 1000);
};

export const freshLeave = () => {
  const userUid = JSON.parse(getCookie("user") as string);
  return {
    name: "",
    type: "4 Hours",
    phone: "",
    email: "",
    duration: null,
    emp_id: null,
    reason: "",
    date: moment().format("L"),
    time: moment().format("LTS"),
    created_at: Timestamp.now(),
    status: "pending",
    uid: userUid.uid,
    added_by: userUid.email,
  };
};

export const getLeave = (data: any) => {
  return {
    name: data.name,
    type: data.type,
    phone: data.phone,
    email: data.email,
    duration: data.duration.slice(0, 2),
    emp_id: data.emp_id,
    reason: data.reason,
    date: data.date,
    time: data.time,
    created_at: data.created_at,
    status: data.status,
    uid: data.uid,
    added_by: data.email,
  };
};

export const freshUpdate = () => {
  const user = JSON.parse(getCookie("user") as string);
  return {
    website_names: "",
    status: "",
    task: "",
    assigned_by: "",
    verified_by: "",
    summary: "",
    emp_id: user && user.emp_id ? user.emp_id : "",
    designation: user && user.designation ? user.designation : "",
    email: user && user.email ? user.email : "",
    name: user && user.username ? user.username : "",
    date: moment().format("L"),
    time: moment().format("LTS"),
    created_at: Timestamp.now(),
    uid: user && user.uid ? user.uid : "",
    added_by: user && user.email ? user.email : "",
  };
};

export const getUpdate = (data: any) => {
  return {
    website_names: data.website_names,
    status: data.status,
    task: data.task,
    assigned_by: data.assigned_by,
    verified_by: data.verified_by,
    summary: data.summary,
    emp_id: data.emp_id,
    designation: data.designation,
    email: data.email,
    name: data.name,
    date: data.date,
    time: data.time,
    created_at: data.created_at,
    uid: data.uid,
    added_by: data.email,
  };
};

export const pushNotificationToDb = async (
  docId: string,
  status: string,
  name: string
) => {
  try {
    console.log("pushNotificationToDb docId :", docId);
    const docRef = doc(db, "notifications", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        notifications: arrayUnion({
          message: name,
          status: status,
          read: false,
          timestamp: Timestamp.now(),
        }),
      });
    } else {
      const docRef = doc(db, "notifications", docId);

      await setDoc(docRef, {
        notifications: [
          {
            message: name,
            status: status,
            read: false,
            timestamp: Timestamp.now(),
          },
        ],
      });
    }
    SuccessToast(`Status updated and notification sent`);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const markNotificationAsReadInDb = async (
  docId: string,
  updatedNotifications: any
) => {
  try {
    const docRef = doc(db, "notifications", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        notifications: updatedNotifications,
      });

      SuccessToast("Notification marked as read!");
    } else {
      console.log("Notification not found!");
    }
  } catch (error: any) {
    console.error("Error updating notification:", error.message);
  }
};

export const isNameIsValid = (name: string) => {
  const invalidCharactersPattern = /[^a-zA-Z\s]/;
  const multipleSpacesPattern = /\s{2,}/;
  if (!invalidCharactersPattern.test(name)) {
    if (!multipleSpacesPattern.test(name)) return false;
  }
  return true;
};

export const validatePhone = (phone: string) => {
  const phoneNumberPattern = /^[6-9]\d{9}$/;
  return phoneNumberPattern.test(phone);
};

export const checkAllFields = (permission: { [key: string]: string }) => {
  return (
    permission?.emp_id !== null &&
    permission?.emp_id?.toString().length !== 0 &&
    permission?.emp_id?.length > 0 &&
    permission?.emp_id?.length === 3 &&
    permission?.name.length > 0 &&
    !isNameIsValid(permission?.name) &&
    validateEmail(permission.email) &&
    validatePhone(permission.phone) &&
    permission?.duration?.toString().length > 0 &&
    permission?.type.length > 0 &&
    permission?.phone.length > 0 &&
    permission?.email.length > 0 &&
    permission?.reason.length > 0
  );
};

export const checkUpdateAllFields = (updates: { [key: string]: string }) => {
  return (
    updates.website_names.length > 0 &&
    updates.status.length > 0 &&
    updates.assigned_by.length > 0 &&
    updates.verified_by.length > 0 &&
    updates.task.length > 0 &&
    updates.summary.length > 0
  );
};
export const checkUpdateFields = (updates: { [key: string]: string }) => {
  return {
    website_names: updates.website_names.length == 0,
    status: updates.status.length == 0,
    assigned_by: updates.assigned_by.length == 0,
    verified_by: updates.verified_by.length == 0,
    task: updates.task.length == 0,
    summary: updates.summary.length == 0,
  };
};

export const checkLeaveFields = (permission: { [key: string]: string }) => {
  return {
    emp_id: permission?.emp_id == null || permission?.emp_id?.length == 0,
    isEmpId3Digit: permission?.emp_id?.length > 3,
    name: permission.name.length == 0,
    isNameWithSpecialCharOrNum: isNameIsValid(permission.name),
    duration: permission.duration == null || permission?.duration?.length == 0,
    type: permission.type.length == 0,
    phone: permission.phone.length == 0,
    email: permission.email.length == 0,
    validEmail: !validateEmail(permission.email),
    validPhone: !validatePhone(permission.phone),
    reason: permission.reason.length == 0,
  };
};

export const extraValidation = (
  keyName: string,
  value: string,
  validations: any,
  setValidations: (a: any) => void
) => {
  if (keyName == "emp_id") {
    setValidations({
      ...validations,
      isEmpId3Digit: value.toString().length > 3,
    });
  } else if (keyName == "name") {
    setValidations({
      ...validations,
      isNameWithSpecialCharOrNum: isNameIsValid(value),
    });
  } else if (keyName == "email") {
    setValidations({
      ...validations,
      validEmail: !validateEmail(value),
    });
  } else if (keyName == "phone") {
    setValidations({
      ...validations,
      validPhone: !validatePhone(value),
    });
  } else {
    setValidations({
      ...validations,
      [keyName]: value.toString().length == 0,
    });
  }
};

export const sendEmail = async (
  email: string,
  message: string,
  html: string,
  subject: string = "Applied leave update"
) => {
  const emailData = {
    email,
    subject,
    message,
    html,
  };

  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure JSON header is set
      },
      body: JSON.stringify(emailData), // Ensure body is JSON stringified
    });

    const data = await res.json();
    if (res.ok) {
      SuccessToast("Email notifcation sent successfully");
    } else {
      console.error("Email sending failed:", data.message);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
