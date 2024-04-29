import NextAuth from "next-auth"


export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [

    {
      id: "casdoor",
      name: "Casdoor登录",
      type: "oidc",
      authorization: {
        params: { scope: process.env.AUTH_OAUTH_SCOPE ?? "openid profile email" }
      },
      issuer: process.env.AUTH_OAUTH_ISSUER_URL,
      clientId: process.env.AUTH_OAUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_OAUTH_CLIENT_SECRET,

      profile(user) {
        return {
          name: user.displayName,
          username: user.name,
          phone: user.phone,
          email: user.email,
          image: user.avatar,
          id: user.id
        }
      }
    }
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  }

})
