type s = string;
type b = boolean;
type n = number;

export interface permissions {
  emp_id: n;
  name: s;
  duration: n;
  type: s;
  email: s;
  phone: s;
  reason: s;
  date: s;
  time: s;
  created_at: s;
  status: s;
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
  createdAt: string;
  designation: string;
  email: string;
  emp_id: string | number;
  password: string;
  phone: string | number;
  role: string;
  uid: string;
  username: string;
  date: string;
}

export interface updates {
  id: s;
  website_names: s;
  assigned_by: s;
  emp_id: s;
  name: s;
  created_at: {
    seconds: n;
    nanoseconds: n;
  };
  added_by: s;
  task: s;
  uid: s;
  date: s;
  email: s;
  designation: s;
  status: s;
  verified_by: s;
  time: s;
  summary: s;
}
