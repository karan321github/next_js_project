import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponse> {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Your SMTP server
    port: 587, // Usually 587 for secure connections
    secure: false, // Set to true if using port 465
    auth: {
      user: process.env.user, // Your email
      pass: process.env.pass, // Your email password or app password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "Anonyms feedback <karanthakurr2001@gmail.com>",
      to: email,
      subject: "Verification Code",
      html: `<Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: ${verifycode}</Preview>
      <Section>
        <Row>
          <h1>Hello ${username},</h1>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text>${verifycode}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        
      </Section>
    </Html>`, // Use html instead of text
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error in sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}

export async function sendSuccessVerification(
  username: string,
  email: string
): Promise<ApiResponse> {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Your SMTP server
    port: 587, // Usually 587 for secure connections
    secure: false, // Set to true if using port 465
    auth: {
      user: process.env.user, // Your email
      pass: process.env.pass, // Your email password or app password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "Anonyms feedback <karanthakurr2001@gmail.com>",
      to: email,
      subject: "Verification success",
      html: `<Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Section>
        <Row>
          <h1>Hello ${username},</h1>
        </Row>
        <Row>
          <Text>
            Your verification has been success , Please login with your id and password
          </Text>
        </Row>
        <Row>
          <Text>
            If you did not verify this, please ignore this email.
          </Text>
        </Row>
        
      </Section>
    </Html>`, // Use html instead of text
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error in sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
