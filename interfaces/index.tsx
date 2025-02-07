import { Timestamp } from "firebase/firestore";

export type s = string;
export type b = boolean;
export type n = number;

export interface Obj {
  [key: string]: string;
}

export interface ObjAny {
  [key: string]: any;
}

export interface permissions {
  [key: string]: any;
  id?: s | undefined;
  emp_id?: s | undefined;
  name?: s | undefined;
  duration?: n | s | undefined;
  type?: s | undefined;
  email?: s | undefined;
  phone?: s | undefined;
  reason?: s | undefined;
  date?: s | undefined;
  time?: s | undefined;
  created_at?: Timestamp;
  status?: s | undefined;
  start_date?: s | undefined;
  end_date?: s | undefined;
  start_time?: s | undefined;
  end_time?: s | undefined;
  uid?: s | undefined;
  leaves?: user_leave_data;
}

export type updates_inteface = {
  website_names: string;
  status: string;
  assigned_by: string;
  verified_by: string;
  task: string;
  summary: string;
};

export interface user {
  id: string;
  confirm_password: string;
  designation: string;
  email: string;
  emp_id: string | number;
  password: string;
  phone: string | number;
  role: string;
  uid: string;
  username: string;
  date: string;
  createdAt: string;
  leaves: user_leave_data;
  accessToken: string;
}

export interface freshUserInterface {
  username: s;
  emp_id: s;
  phone: s;
  role: s;
  email: s;
  password: s;
  confirm_password: s;
  designation: s;
  leaves: {
    casual: number;
    sick: number;
  };
}

export type userKeys =
  | "id"
  | "confirm_password"
  | "createdAt"
  | "designation"
  | "email"
  | "emp_id"
  | "password"
  | "phone"
  | "role"
  | "uid"
  | "username"
  | "date";

export interface updates {
  [key: string]: any;
  id?: s;
  website_names: s;
  assigned_by?: s;
  emp_id?: s;
  name: s;
  created_at?: Timestamp;
  added_by?: s;
  task: s;
  uid?: s;
  date: s;
  email: s;
  designation: s;
  status: s;
  verified_by?: s;
  time?: s;
  summary?: s;
}

export interface slotType {
  start_time?: string | undefined;
  end_time?: string | undefined;
  start_date?: string | undefined;
  end_date?: string | undefined;
}

export interface holiday {
  slNo: n;
  dates: Obj[];
  holidayName: s;
  date: s;
  day: s;
  doublePay: boolean;
}

type event_activities = {
  name: s;
  description: s;
  start_time: s;
  end_time: s;
};

export interface eventInterface {
  img_src: s;
  category: s;
  description: string;
  date: s;
  name: s;
  start_time: s;
  end_time: s;
  note: s;
  activities: event_activities[];
}

export type user_leave_data = {
  sick: number;
  casual: number;
};

export type TimestampObj = {
  seconds: n;
  nanoseconds: n;
};

export interface notificationsInterface {
  read: b;
  timestamp: Timestamp;
  message: s;
  status: s;
}

export type status = "pending" | "rejected" | "approved";

export type params = {
  value: status;
};

export interface leaveInterface {
  emp_id: b;
  isEmpId3Digit: b;
  name: b;
  isNameWithSpecialCharOrNum: b;
  duration: b;
  durationLimit: b;
  type: b;
  phone: b;
  email: b;
  validEmail: b;
  validPhone: b;
  reason: b;
}

export interface bugInterface {
  bug_title: s;
  bug_description: s;
  bug_priority: s;
  device_browser_info: s;
  expected_behaviour: s;
  step_to_reproduce: s;
  screenshot_upload: string[];
}
