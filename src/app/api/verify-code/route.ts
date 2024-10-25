import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";




export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username,code}= await request.json()
        // decode first if anything comes from url - (space to %20),(will get the actual version)
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        
        if (!user) {
            return Response.json(
                {
                  success: false,
                  message: "--- user not found @verify-code/route.ts.!",
                },
                { status: 500 }
            );
        }
        // now if we got the user then -> mactchcode ,check expiry 

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                  success: true,
                  message: "---Account verified successfully @verify-code/route.ts.!",
                },
                { status: 200 }
            );
        }
        else if(!isCodeNotExpired){
            return Response.json(
                {
                  success: false,
                  message: "--- OTP Code expired , Please signup again to get a new code",
                },
                { status: 400 }
            );
        }
        else{
            return Response.json(
                {
                  success: false,
                  message: "--- Incorrect Verification Code ",
                },
                { status: 500 }
            );
        }


    } catch (err) {
        console.error("--Error verifying user @verify-code/route.ts, err::",err)
        return Response.json(
            {
              success: false,
              message: "--- Error verifying user @verify-code/route.ts.!",
            },
            { status: 500 }
        );
    }
}