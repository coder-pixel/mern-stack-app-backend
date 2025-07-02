export enum UserRoleEnum {
  User = "user",
  Admin = "admin",
  Manager = "manager",
}

export enum UploadTypeEnum {
  ProfileImage = "profileImage",
  Document = "document",
  Images = "images",
}

export interface IUser {
  _id?: string;
  email: string;
  username: string;
  name?: string; // Full name
  role: UserRoleEnum;
  password?: string;
  state?: string;
  profileImage?: string;
  document?: string;
}

export interface IFile extends Express.Multer.File {
  path: string;
  filename: string;
}
