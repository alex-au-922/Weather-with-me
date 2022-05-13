const { DatabaseError, UnauthorizationError } = require("../../errorConfig");
const {
  checkUserCredentialsById,
} = require("../../generalUtils/userCreds/username");

const getUserFavouriteLocations = async (userId) => {
  try {
    const existUser = await checkUserCredentialsById(userId);
    if (existUser === null) throw new UnauthorizationError("User not found!");
    return existUser.favouriteLocation;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

exports.getUserFavouriteLocations = getUserFavouriteLocations;
