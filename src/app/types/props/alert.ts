import { Types } from "mongoose";

export interface Alert {
  _id: Types.ObjectId;
  message: string;
  link: string;
  userId: Types.ObjectId;
  read: boolean;
}
