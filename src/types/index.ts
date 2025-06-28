export interface IUser {
  _id?: string;
  email: string;
  username: string;
  role: "user" | "admin";
}
