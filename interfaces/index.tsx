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
}

export type updates_inteface = {
  website_names: string;
  status: string;
  assigned_by: string;
  verified_by: string;
  task: string;
  summary: string;
};
