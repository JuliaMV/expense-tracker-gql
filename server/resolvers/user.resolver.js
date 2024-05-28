import { users } from "../dummyData/data.js";

const userResolver = {
  Query: {
    users: (parent, args, context, info) => {
      return users;
    },
    user: (_, { userId }) => {
      return users.find((user) => user._id === userId);
    },
    // authUser: User!
    // user(userId: ID!): User
  },

  // Mutation {
  //     signUp(input: SignUpInput!): User
  //     login(input: LoginInput!): User
  //     logout: LogoutResponse
  // }
};

export default userResolver;
