export interface User {
  _id: string;
  email: string;
  role: "creator" | "participant";
}