import { Request, Response } from "express";
import { getTotalUsers, getUsers } from "../services/user.service";
import { queryBuilder } from "../utils/queryBuilder";

export const getAllUsers = async (req: Request, res: Response) => {
  // 1. Build the query
  const { skip, limit, page, sortBy, sortOrder, filter } = queryBuilder(req);

  // 2. Fetch paginated users
  const usersListPromise = getUsers({ skip, limit, filter, sortBy, sortOrder });

  // 3. Fetch total count (efficiently, without fetching all documents)
  // If you have filters, ensure the count query uses the same filters.
  const totalUsersCountPromise = getTotalUsers(filter); // no need to pass sortBy and sortOrder here, as it's not used in returning the total count

  // 4. Wait for all promises to resolve, doing this in parallel (faster)
  const [usersList, totalUsersCount] = await Promise.all([
    usersListPromise,
    totalUsersCountPromise,
  ]);

  res.status(200).json({
    error: false,
    users: usersList, // users list (paginated and/or sorted and/or filtered)
    totalCount: totalUsersCount, // total count (without pagination, but with filters)
    currentPage: page, // current page
    totalPages: Math.ceil(totalUsersCount / limit), // total pages
    limit, // limit
    hasNextPage: page < Math.ceil(totalUsersCount / limit), // has next page
  });
};
