import {
  Obj,
  freshUserInterface,
  leaveInterface,
  notificationsInterface,
  params,
  permissions,
  s,
  updates,
  user,
} from "@/interfaces";
import * as XLSX from "xlsx";
import cookie from "cookie";
import CryptoJS from "crypto-js";
import { db } from "@/config/firebase";
import { Bounce, toast } from "react-toastify";
import {
  DocumentReference,
  DocumentSnapshot,
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
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { AgGridReact } from "ag-grid-react";

export const removeKeyFromArray = (
  arr: permissions[],
  key: keyof permissions
) => {
  return arr.map((item: permissions) => {
    const { [key]: _, ...rest } = item; // Destructure to remove the key
    return rest;
  });
};

export const exportToExcel = (jsonData: unknown[]) => {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate Excel file and download
  XLSX.writeFile(workbook, "EmployeeData.xlsx");
};

export const getData = async () => {
  const tempData: permissions[] = [];
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
  if (emailPattern.test(email) && checkDomain) {
    return true;
  }
  return false;
};

export const checkPassword = (password: string, confirm_password: string) => {
  const checkPasswordCompxity = isPasswordComplex(password);

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
    const parts: string[] = value.split(`; ${name}=`);
    if (parts && parts.length === 2) {
      const encryptedCookie = parts?.pop()?.split(";").shift();
      const user_uid = getItemFromLocal("uid");
      const decryptedCookie = decryptData(encryptedCookie as string, user_uid);
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

export const setItemToLocal = (
  name: string = "user",
  value: unknown | unknown[]
) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const getItemFromLocal = (name: string = "user") => {
  const getUser: string | null = localStorage.getItem(name);
  return JSON.parse(getUser as string);
};

export const setItemToSession = (
  name: string = "user",
  value: unknown | unknown[]
) => {
  sessionStorage.setItem(name, JSON.stringify(value));
};

export const getItemFromSession = () => {
  const getUser: string | null = sessionStorage.getItem("user");
  return JSON.parse(getUser as string);
};

export const addUserToDB = async (
  userDoc: DocumentReference,
  userData: freshUserInterface,
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
    const userDocSnap = await getDoc(userDocRef);
    const userDB: user = userDocSnap.data() as user;
    const { password, confirm_password, ...userData } = userDB;

    const encryptUser = encryptData(JSON.stringify(userData), docId);
    setCookie("user", encryptUser, 1);
  } catch (error) {
    handleCatchError(error);
    throw error;
  }
};

export const deleteAllCookies = (
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
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
  CellStatusRenderer: (a: params) => void,
  db_data: permissions[],
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
            filter: true,
            cellRenderer: CellStatusRenderer,
            cellRendererParams: (params: params) => {
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
            filter: true,
            cellRenderer: CellStatusRenderer,
            cellRendererParams: (params: params) => {
              params: params;
            },
          },
        ];
  }

  return "";
};

//? This two I need to check data should follow same format
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
    handleCatchError(error);
    return false;
  }
};

// Encrypt data
export const encryptData = (data: string, secretKey: string) => {
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

    return bytes
      .toString(CryptoJS.enc.Utf8)
      .replace(process.env.NEXT_PUBLIC_HASH_SALT as string, "");
  } else return "";
};

export const getLeave = (data: permissions) => {
  return {
    name: data.name,
    type: data.type,
    phone: data.phone,
    email: data.email,
    duration: data.duration,
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

export const getUpdate = (data: updates) => {
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
  type errorType = {
    error: string;
  };
  try {
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
  } catch (error) {
    handleCatchError(error);
  }
};

export const handleCatchError = (
  error: unknown,
  customeMessage: s = "An unknown error occurred"
) => {
  if (error instanceof Error) {
    ErrorToast(error.message);
  } else {
    console.log("error", error);
    ErrorToast(customeMessage);
  }
};
export const markNotificationAsReadInDb = async (
  docId: string,
  updatedNotifications: notificationsInterface[]
) => {
  try {
    const docRef = doc(db, "notifications", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        notifications: updatedNotifications,
      });

      SuccessToast("Notification marked as read!");
    }
  } catch (error) {
    handleCatchError(error);
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

export const checkAllFields = (permission: permissions) => {
  return (
    permission?.emp_id !== null &&
    permission?.emp_id !== undefined &&
    permission?.name !== undefined &&
    permission?.email !== undefined &&
    permission?.phone !== undefined &&
    permission?.duration !== undefined &&
    permission?.type !== undefined &&
    permission?.reason !== undefined &&
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

export const checkLeaveFields = (permission: permissions) => {
  const ud = undefined;
  const fs = false;
  const nl = null;
  return {
    emp_id: permission?.emp_id == null || permission?.emp_id?.length == 0,
    isEmpId3Digit:
      permission?.emp_id == ud || nl ? fs : permission?.emp_id?.length > 3,
    name: permission?.name == ud || nl ? fs : permission.name.length == 0,
    isNameWithSpecialCharOrNum:
      permission?.name == ud || nl ? fs : isNameIsValid(permission.name),
    duration:
      permission?.duration == ud || nl
        ? fs
        : permission.duration == null ||
          permission?.duration.toString()?.length == 0,
    durationLimit:
      permission?.duration == ud || nl
        ? fs
        : parseInt(permission.duration as string) > 10,
    type: permission?.type == ud || nl ? fs : permission.type.length == 0,
    phone: permission?.phone == ud || nl ? fs : permission.phone.length == 0,
    email: permission?.email == ud || nl ? fs : permission.email.length == 0,
    validEmail:
      permission?.email == ud || nl ? fs : !validateEmail(permission.email),
    validPhone:
      permission?.phone == ud || nl ? fs : !validatePhone(permission.phone),
    reason: permission?.reason == ud || nl ? fs : permission.reason.length == 0,
  };
};

export const extraValidation = (
  keyName: string,
  value: string,
  validations: leaveInterface,
  setValidations: (a: leaveInterface) => void
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
  userName: string,
  userPassword: string,
  email: string,
  subject: string
) => {
  const emailData = {
    userName,
    userPassword,
    email,
    subject,
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
    res.ok
      ? SuccessToast("Email notifcation sent successfully")
      : console.error("Email sending failed:", data.message);
  } catch (error) {
    handleCatchError(error, "Error while sending error");
  }
};

export const sendStatusEmail = async (
  userName: string,
  leaveType: string,
  startDate: string,
  endDate: string,
  date: string,
  status: string,
  emailTo: string
) => {
  const emailData = {
    userName,
    leaveType,
    startDate,
    endDate,
    date,
    status,
    emailTo,
  };

  try {
    const res = await fetch("/api/send-notification", {
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
    handleCatchError(error);
  }
};

export const handleOverlay = (gridRef: React.RefObject<AgGridReact>) => {
  if (gridRef?.current) {
    const rowCount = gridRef?.current?.api.getDisplayedRowCount();

    if (rowCount === 0) {
      gridRef.current.api.showNoRowsOverlay();
    } else {
      gridRef.current.api.hideOverlay();
    }
  }
};

export const controleText = (text: string, limit: number = 20) => {
  if (text.length > limit) return text.slice(0, limit) + "...";
  else return text;
};

export const fetchEmployeeByEmpId = async (emp_id: string) => {
  let data: Obj[] = [];
  const employeeCollection = collection(db, "users");

  const q = query(employeeCollection, where("emp_id", "==", emp_id));

  // Execute the query
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      const { username, phone, email, leaves } = doc.data();
      data.push({
        name: username,
        phone,
        email,
        leaves,
      });
    });
  }
  return data[0];
};

export const fetchEmpLeavesByType = async (
  emp_id: string,
  leave_type: string
) => {
  let data: Obj[] = [];
  const employeeCollection = collection(db, "permissions");

  const q = query(
    employeeCollection,
    where("emp_id", "==", emp_id),
    where("type", "==", leave_type.toLowerCase())
  );

  // Execute the query
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  }
  let sum = 0;
  data.forEach((item: Obj) => {
    sum += parseInt(item["duration"]);
    return sum;
  });
  return sum;
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const deleteUser = async (uid: string) => {
  try {
    const response = await fetch("/api/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, docId: uid }),
    });

    const result = await response.json();
    if (response.ok) {
      SuccessToast(result.message);
    } else {
      ErrorToast(result.error);
    }
  } catch (error) {
    handleCatchError(error);
  }
};

export const handleStatusEmail = async (
  name: s,
  type: s,
  start_date: s,
  start_time: s,
  end_date: s,
  end_time: s,
  date: s,
  email: s,
  status: s
) => {
  await sendStatusEmail(
    name,
    capitalizeFirstLetter(type),
    start_date ? start_date : start_time,
    end_date ? end_date : end_time,
    date,
    capitalizeFirstLetter(status),
    email
  );
};
