import { resend } from "@/lib/resend";

import verificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery message",
      react: verificationEmail({ username, otp: verifycode }),
    });

    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery message",
      react: verificationEmail({ username, otp: verifycode }),
    });
    console.log("Email sent response:", response);

    return { success: true, message: "verification email sent successfully" };
  } catch (emailError) {
    console.error("error in sending Verification email", emailError);
    return { success: false, message: "failed to send  verification email" };
  }
}
