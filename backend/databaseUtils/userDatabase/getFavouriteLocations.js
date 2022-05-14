//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
