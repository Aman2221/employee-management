import { getCookie } from "@/functions";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const default_superuser_opts = (
  router: AppRouterInstance,
  handleExport: () => void
) => {
  return [
    {
      name: "home",
      path: "",
      pathname: "",
      svg: "/sidebar-icons/home.svg",
    },
    {
      name: "view updates",
      path: "view-updates",
      pathname: "view-updates",
      svg: "/sidebar-icons/dash.svg",
    },
    {
      name: "view leaves",
      path: "view-leaves",
      pathname: "view-leaves",
      svg: "/sidebar-icons/square-box.svg",
    },
    {
      name: "my profile",
      path: "view-profile",
      pathname: "view-profile",
      onClick: () => router.push("/view-profile"),
      svg: "/sidebar-icons/user.svg",
    },
    {
      name: "register user",
      path: "register",
      pathname: "register",
      onClick: () => router.push("/register"),
      svg: "/sidebar-icons/users.svg",
    },
    {
      name: "export data",
      onClick: handleExport,
      pathname: "",
      svg: "/sidebar-icons/sign-in.svg",
    },
    {
      name: "upcoming event's",
      path: "upcoming-events",
      pathname: "upcoming-events",
      onClick: () => router.push("/upcoming-events"),
      svg: "/sidebar-icons/events.svg",
    },
    {
      name: "upcoming holiday's",
      path: "upcoming-holidays",
      pathname: "upcoming-holidays",
      onClick: () => router.push("/upcoming-holidays"),
      svg: "/sidebar-icons/upcoming-holidays.svg",
    },
    {
      name: "Leave Policy",
      path: "leave-policy",
      pathname: "leave-policy",
      onClick: () => router.push("/leave-policy"),
      svg: "/sidebar-icons/file.svg",
    },
    {
      name: "App Documentatiom",
      path: "app-documentation",
      pathname: "app-documentation",
      onClick: () => router.push("/app-documentation"),
      svg: "/sidebar-icons/pdf.svg",
    },
    {
      name: "travel & expenses",
      path: "travel-and-expenses",
      pathname: "travel-and-expenses",
      onClick: () => router.push("/travel-and-expenses"),
      svg: "/sidebar-icons/file-fill.svg",
    },
    {
      name: "Report",
      path: "report-bug",
      pathname: "report-bug",
      onClick: () => router.push("/report-bug"),
      svg: "/sidebar-icons/bug.svg",
    },
    {
      name: "FAQ's",
      path: "faqs",
      pathname: "faqs",
      onClick: () => router.push("/faqs"),
      svg: "/sidebar-icons/FAQ.svg",
    },
    {
      name: "settings",
      path: "settings",
      pathname: "settings",
      onClick: () => router.push("/settings"),
      svg: "/sidebar-icons/settings.svg",
    },
    {
      name: "view bugs",
      path: "view-bugs",
      pathname: "view-bugs",
      onClick: () => router.push("/view-bugs"),
      svg: "/sidebar-icons/view-bugs.svg",
    },
  ];
};

export const default_employee_opts = (router: AppRouterInstance) => {
  return [
    {
      name: "home",
      path: "",
      pathname: "",
      onClick: () => router.push("/"),
      svg: "/sidebar-icons/home.svg",
    },
    {
      name: "my leaves",
      path: "view-leaves",
      pathname: "view-leaves",
      onClick: () => router.push("/view-leaves"),
      svg: "/sidebar-icons/sign-in.svg",
    },
    {
      name: "my updates",
      path: "view-updates",
      pathname: "view-updates",
      onClick: () => router.push("/view-updates"),
      svg: "/sidebar-icons/square-box.svg",
    },
    {
      name: "my profile",
      path: "view-profile",
      pathname: "view-profile",
      onClick: () => router.push("/view-profile"),
      svg: "/sidebar-icons/user.svg",
    },
    {
      name: "upcoming event's",
      path: "upcoming-events",
      pathname: "upcoming-events",
      onClick: () => router.push("/upcoming-events"),
      svg: "/sidebar-icons/events.svg",
    },
    {
      name: "upcoming holiday's",
      path: "upcoming-holidays",
      pathname: "upcoming-holidays",
      onClick: () => router.push("/upcoming-holidays"),
      svg: "/sidebar-icons/upcoming-holidays.svg",
    },
    {
      name: "Leave Policy",
      path: "leave-policy",
      pathname: "leave-policy",
      onClick: () => router.push("/leave-policy"),
      svg: "/sidebar-icons/file.svg",
    },
    {
      name: "travel & expenses",
      path: "travel-and-expenses",
      pathname: "travel-and-expenses",
      onClick: () => router.push("/travel-and-expenses"),
      svg: "/sidebar-icons/file-fill.svg",
    },
    {
      name: "FAQ's",
      path: "faqs",
      pathname: "faqs",
      onClick: () => router.push("/faqs"),
      svg: "/sidebar-icons/FAQ.svg",
    },
    {
      name: "settings",
      path: "settings",
      pathname: "settings",
      onClick: () => router.push("/settings"),
      svg: "/sidebar-icons/settings.svg",
    },
  ];
};

export const freshUser = {
  username: "",
  emp_id: "",
  phone: "",
  role: "employee",
  email: "",
  password: "",
  confirm_password: "",
  designation: "business analyst",
  leaves: {
    casual: 12,
    sick: 6,
  },
};

export const freshLeave = () => {
  const userUid = JSON.parse(getCookie("user") as string);
  return {
    name: "",
    type: "permission",
    phone: "",
    email: "",
    duration: "",
    emp_id: "",
    reason: "",
    date: moment().format("L"),
    time: moment().format("LTS"),
    created_at: Timestamp.now(),
    status: "pending",
    uid: userUid.uid,
    added_by: userUid.email,
  };
};

export const freshUpdate = () => {
  const user = JSON.parse(getCookie("user") as string);
  return {
    website_names: "",
    status: "Completed",
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

export const freshBug = () => {
  return {
    bug_title: "",
    bug_description: "",
    bug_priority: "select bug priority",
    device_browser_info: "",
    expected_behaviour: "",
    step_to_reproduce: "",
    screenshot_upload: [],
    created_at: Timestamp.now(),
  };
};

export const bugInputs: string[] = [
  "bug_priority",
  "device_browser_info",
  "expected_behaviour",
  "step_to_reproduce",
  "screenshot_upload",
];
