import connectDB from "@/lib/connectDB";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, email, password } = await request.json();
  } catch (error) {
    console.error("Error in regestering user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
