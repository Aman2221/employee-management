import { permissions } from "@/interfaces";
import * as XLSX from "xlsx";
import {
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
  const domain = "@primasoft.ae";
  if (!email.endsWith(domain)) {
    return false;
  }
  return true;
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
  const value = `; ${document.cookie}`;
  const parts: any = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const encryptedCookie = parts.pop().split(";").shift();
    const user_uid = getItemFromLocal("uid");
    const decryptedCookie = decryptData(encryptedCookie, user_uid);

    return decryptedCookie;
  }
  return null;
}

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
    const userDocRef = doc(db, "users", "H668hSKmrcdCY6rfNsSmIc1egBs2");
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
  const user_role = user.role.toLowerCase();
  return [
    user_role == "hr" || user_role == "manager"
      ? {
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
        }
      : {
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

    SuccessToast("Status updated!");
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
