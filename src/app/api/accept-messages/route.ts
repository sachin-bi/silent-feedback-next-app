import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;     //TODO: watch out! might be issue with ts, User

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;    //TODO: watch out! might be issue
  const { acceptMessages } = await request.json();  // why this line

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    //By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    
    if (!updatedUser) {
        return Response.json(
            {
              success: false,
              message: " failed to update user status to accept messages ",
            },
            { status: 401 }
        );
    }

    return Response.json(
        {
          success: true,
          message: "Message acceptance status updated successfully ",
          updatedUser,
        },
        { status: 200 }
    );

  } 
  catch (err) {
    console.log(
      "--- failed to update user status to accept messages _@accept-messages/route.ts err:",
      err
    );
    return Response.json(
      {
        success: false,
        message: " failed to update user status to accept messages ",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
    await dbConnect();
  
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;     //TODO: watch out! might be issue with ts, User
  
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }
  
    const userId = user._id;    //TODO: watch out! might be issue
    
    try {
    const foundUser = await UserModel.findById(userId)
     
     
    if (!foundUser) {
          return Response.json(
              {
                success: false,
                message: "User not found",
              },
              { status: 404 }
          );
    }
  
    return Response.json(
        {
          success: true,
          message: "User found ",
          isAcceptingMessage : foundUser.isAcceptingMessage,
        },
        { status: 200 }
    );


} 
catch (err) {
  console.log(
    "--- Error in getting is acceptingMessages status  _@accept-messages/route.ts err:",
    err
  );
  return Response.json(
    {
      success: false,
      message: " Error in getting is acceptingMessages status .! ",
    },
    { status: 500 }
  );
}
}
