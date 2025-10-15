export type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinDate: string;
};

export type UserFormDataType = Omit<UserType, "id" | "avatar" | "joinDate">;

export type UserRole = "Admin" | "Editor" | "User";
