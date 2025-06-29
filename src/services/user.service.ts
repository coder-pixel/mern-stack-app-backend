import { User } from "../models/user";

/**
 * Get all users (consider adding pagination/filter in future)
 */
export const getUsers = async () => {
  return await User.find();
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string) => {
  // return await User.findOne({ email }).select('-password'); // never return password  => no need to do this, as we have already set it to false in the schema
  return await User.findOne({ email });
  // ✅ .select('-password') is optional if excluded in schema
};

/**
 * Get user by session token
 */
// used to validate user session
// export const getUserBySessionToken = async (sessionToken: string) => {
//   return await User.findOne({
//     "authentication.sessionToken": sessionToken,
//   });
// };

/**
 * Get user by ID
 */
export const getUserById = async (id: string) => {
  return await User.findById(id);
};

/**
 * Get user by type and token
 * type can be emailVerificationToken or resetPasswordToken or any other token type added to the user model
 * will check if the token is not expired and is valid,
 * need to pass the type and token to the function
 */
export const getUserByVerificationTokenType = async (
  tokenType: string,
  tokenExpiresAtField: string,
  token: string
) => {
  return await User.findOne({
    [tokenType]: token,
    [tokenExpiresAtField]: { $gt: new Date() },
  });
};

/**
 * Create and save a new user
 */
export const createUser = async (values: Record<string, any>) => {
  const user = new User(values);
  await user.save();
  return user.toObject(); // ✅ convert Mongoose doc to plain object
};

/**
 * Delete a user by ID
 */
export const deleteUserById = async (id: string) => {
  return await User.findByIdAndDelete({ _id: id });
};

/**
 * Update a user by ID
 */
export const updateUserById = async (
  id: string,
  values: Record<string, any>
) => {
  return await User.findByIdAndUpdate(id, values, { new: true }); // ✅ new: true returns updated doc
};
