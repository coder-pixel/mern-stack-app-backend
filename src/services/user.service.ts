import { User } from "../models/user";
import { IUser } from "../types";

/**
 * Get all users (consider adding pagination/filter in future)
 * @param params - parameters
 * @param params.skip - skip
 * @param params.limit - limit
 * @param params.filter - filter
 * @param params.sortBy - sort by
 * @param params.sortOrder - sort order
 * @returns users
 */
export const getUsers = async (params: {
  skip?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: number;
  filter?: Record<string, any>;
}): Promise<IUser[]> => {
  const { skip, limit, sortBy, sortOrder, filter } = params;

  // 1. Build the query
  let query = User.find(); // initial query

  // 2. Add filters if provided (should be applied early to narrow down the dataset)
  if (filter) {
    query = query.find(filter);
  }

  // 3. Add sorting if provided (should be applied before skip/limit)
  if (sortBy && typeof sortOrder === "number") {
    query = query.sort({ [sortBy]: sortOrder as 1 | -1 });
  }
  // 4. Add pagination if provided (should be applied after filtering and sorting)
  // Apply skip and limit only if they are provided and valid
  if (limit && limit > 0) {
    query = query.limit(limit);
  }
  if (skip && skip >= 0) {
    query = query.skip(skip);
  }

  // 5. Execute the query
  const users = await query;

  // 6. Return the users
  return users;
};

/**
 * Get total users,
 * @param filter - filter object
 * @returns total users
 */
export const getTotalUsers = async (filter: Record<string, any>) => {
  return await User.countDocuments(filter); // ✅ Use countDocuments for total count, it's more efficient than find()
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
