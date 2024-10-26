import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // gaogle, facebook any that u want
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

  // imp.
export const authOptions: NextAuthOptions = {
  providers: [

    CredentialsProvider({
      // or githubProvider or googleProvider, etc
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        // if it war githubProvider then authorize would be done by itself by next-auth,, but here in credentialProvider you need to look how to authorize
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error(
              "-- No user found with this email.!--nextauth/options.ts"
            );
          }

          if (!user.isVerified) {
            throw new Error(
              "-- Pls verify(otp), your account before login.!--nextauth/options.ts"
            );
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("-- Incorrect Password .!--nextauth/options.ts");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },

    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {  // jwt ki strategy laga ke kam khatam hum kr sakte thhe ...but hume bar bar db call nahi karna ... thats why modifying callbacks  
   
    async jwt({ token, user }) {  //jwt mai token aur user mil rahe thhe ... so i give details of user in token
      if (user) {
        // modifying token - so much
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) { //here token info shifted to session.... Advantage of both- can get data from both token/session
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },


  secret: process.env.NEXTAUTH_SECRET,
};


// configure middleware - nextAuth runs through MW