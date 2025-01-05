import { Types } from "mongoose";
import { User } from "./props/user";

export interface UpdateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
      _id: Types.ObjectId;
      fullName: string;
      email: string;
      password: string;
      phone: string;
    }) => void;
    initialUserData: User;
  }