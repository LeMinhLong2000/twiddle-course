"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";

interface CreateUserParams {
  userId: String;
  email: String;
  username: String;
  name: String;
  image: String;
}

export const createUser = async ({
  userId,
  email,
  name,
  username,
  image,
}: CreateUserParams): Promise<void> => {
  try {
    connectToDB();
    await User.create({
      id: userId,
      username: username?.toLowerCase(),
      name,
      email,
      image,
    });
  } catch (err: any) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
};

export const fetchUser = async (userId: string) => {
  try {
    connectToDB();

    return await User.findOne({
      id: userId,
    });
  } catch (err: any) {
    throw new Error(`Failed to fetch user: ${err.message}`);
  }
};

interface updateUserParams {
  userId: string;
  email?: string;
  username?: string;
  name?: string;
  bio?: string;
  image?: string;
  path?: string;
}

export const updateUser = async ({
  userId,
  name,
  email,
  username,
  bio,
  path,
  image,
}: updateUserParams): Promise<void> => {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      {
        name,
        email,
        username,
        bio,
        path,
        image,
        onboarded: true,
      }
    );

    if (path === "/profile/edit") revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Failed to update user info: ${err.message}`);
  }
};

export const fetchUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) => {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUserCount = await User.countDocuments(query);
    const users = await userQuery.exec();
    const isNext = totalUserCount > skipAmount + users.length;

    return { users, isNext };
  } catch (err: any) {
    throw new Error(`Failed to fetch users: ${err.message}`);
  }
};
