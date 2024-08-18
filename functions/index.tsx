import { permissions } from "@/interfaces";
import * as XLSX from "xlsx";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { Bounce, toast } from "react-toastify";
import { getAuth, getIdTokenResult } from "firebase/auth";
// import { cookies } from "next/headers";

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
  if (typeof document === "undefined") {
    return null;
  }

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
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
  console.log("response :", response);
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

export const setUserToLocal = (name: string = "user", value: any) => {
  localStorage.setItem("user", JSON.stringify(value));
};

export const getUserFromLocal = () => {
  const getUser: any = localStorage.getItem("user");
  return JSON.parse(getUser);
};

export const setItemToSession = (name: string = "user", value: any) => {
  sessionStorage.setItem("user", JSON.stringify(value));
};

export const getItemFromSession = () => {
  const getUser: any = sessionStorage.getItem("user");
  return JSON.parse(getUser);
};
