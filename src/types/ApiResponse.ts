import { Message } from "@/models/user";

export interface ApiResponse {
  success: boolean;
  message: String;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
}
