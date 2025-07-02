export enum UserRole {
  User = "user",
  Admin = "admin",
  Manager = "manager",
}
export interface IUser {
  _id?: string;
  email: string;
  username: string;
  role: UserRole;
  password?: string;
  state?: string;
}
