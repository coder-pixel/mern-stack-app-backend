require("dotenv").config(); // Load environment variables - need to be at top
import mongoose from "mongoose";
import { User } from "../models/user";
import { updateUserById } from "../services/user.service";

const mongoUri = process.env.MONGO_DB_URI!;

// define the migration process
const runMigration = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    const usersToUpdate = await User.find({
      $or: [
        { profileImage: { $exists: false } }, // if profileImage does not exist
        { resume: { $exists: false } }, // if resume does not exist
      ],
    });

    console.log(`Found ${usersToUpdate?.length} users to update.`);

    for (const user of usersToUpdate) {
      const updateData: any = {};

      if (!user?.profileImage) {
        updateData.profileImage = "";
      }

      if (!user?.document) {
        updateData.document = "";
      }

      await User.findByIdAndUpdate(user?._id, { $set: updateData });
    }

    console.log("✅ Migration completed successfully.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
};

// execute the migration
runMigration();
