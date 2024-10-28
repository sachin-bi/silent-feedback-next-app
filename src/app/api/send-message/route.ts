import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if (!user.isVerified) {
      return Response.json(
        {
          success: false,
          message: `${user.username} - User not verified.!`,
        },
        { status: 400 }
      );
    }

    // is user accepting  messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: `${user.username} - User is not accepting messages!`,
        },
        { status: 403 } //forbidden
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully!",
      },
      { status: 200 }
    );

  } catch (err) {

    console.log("---error from send-Messages route:",err)
    
    return Response.json(
      {
        success: false,
        message :'Err in send-messages/route',
      },
      { status: 500}
    );
  }
}
