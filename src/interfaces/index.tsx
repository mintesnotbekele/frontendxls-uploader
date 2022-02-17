import { Dayjs } from "dayjs";

export interface IDepartment {
  id: string;
  uid: string;
  name: string;
}

export interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  department: { uid: string; id: string };
  createdAt: string;
  address: {
    id: string;
    city?: string;
    subCity?: string;
    woredaOrKebele?: string;
    houseNumber?: string;
  };
  birthDate?: string;
  blocked: boolean;
  christianityName?: string;
  church?: string;
  confirmed: boolean;
  currency?: string;
  detail?: string;
  educationStatus: any[];
  email: string;
  maritalStatus?: string;
  phoneNumber?: string;
  role: {
    id: string;
    name: string;
  };
  salary?: number;
  updated_at?: string;
  userTitle?: string;
}

export interface ILoginForm {
  username: string;
  password: string;
  remember: boolean;
}

export interface IUserFilterVariables {
    q: string;
    user: string;
    gender: string;
    createdAt: [Dayjs, Dayjs];
}
