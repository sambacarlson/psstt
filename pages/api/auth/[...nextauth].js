import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "modals/User";
import DailyCheck from 'modals/DailyChecks'
import DB from "lib/db";
import { to_YY_MM_DD } from "lib/util";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async session({ session }) {
      if (!session) return session;

      console.log('creating new user on session: ',session)

      // connect DB
      await DB();
      // check if the user is already present or not
      const isUser = await User.findOne({ email: session?.user?.email });
      if (isUser) {
        console.log('user already exists: ',isUser)
        session.user._id = isUser._id;

        let userDailyCheck;
        const dailyCheckFound = await DailyCheck.findOne({userId: isUser._id, date: to_YY_MM_DD(new Date())})

        if(!dailyCheckFound){
          const dailyCheck = new DailyCheck({
           userId: isUser._id,
           date: to_YY_MM_DD(new Date()),
           loginTime: new Date(),
          });  
          
          userDailyCheck = await dailyCheck.save()
        }else{
          userDailyCheck = dailyCheckFound
        }


        session.dailyCheckId = userDailyCheck._id
        return session;
      }

    try {
        // create a new user
        const user = new User({
          email: session.user.email,
          image: session.user.image,
          name: session.user.name,
        });
       const userCreated =  await user.save();


       const dailyCheck = new DailyCheck({
        userId: userCreated._id,
        date: to_YY_MM_DD(new Date()),
        loginTime: new Date(),
       });  

       const userDailyCheck = await dailyCheck.save()
  
        session.user._id = userCreated._id;
        session.dailyCheckId = userDailyCheck._id
        return session;
    } catch (error) {
      console.log('error creating user: ',error)
    }
    },
  },
  debug: true,
  secret: process.env.GOOGLE_CLIENT_SECRET || "123",
});
