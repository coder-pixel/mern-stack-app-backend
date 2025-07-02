export const queryBuilder = (req: any) => {
  // ------------------------ PAGINATION ------------------------
  // 1. apply pagination if any
  const page = parseInt(req?.query?.page as string);
  const limit = parseInt(req?.query?.limit as string);
  const skip = (page - 1) * limit;

  // ------------------------ FILTERS ---------------------------
  // 2. apply filters if any
  const search = req?.query?.search as string;
  const role = req?.query?.role as string;
  const isVerified = req?.query?.isVerified === "true"; // convert to boolean

  // 3. build dynamic filters object
  // ✅ Use dynamic filters to avoid hardcoding filters in the query
  const filter: Record<string, any> = {};

  // add search filter, if search is provided
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // add role filter, if role is provided
  if (role) {
    filter.role = role;
  }

  // add isVerified filter, if isVerified is provided
  if (isVerified) {
    filter.isVerified = isVerified;
  }

  // -------------------- SORTING -------------------------------
  // 4. apply sorting if any
  const sortBy = (req?.query?.sortBy as string) || "createdAt"; // default sort by createdAt
  const sortOrder = req?.query?.sortOrder === "desc" ? -1 : 1; // default sort order is ascending

  // 5. return the query
  return { skip, limit, page, sortBy, sortOrder, filter };
};
