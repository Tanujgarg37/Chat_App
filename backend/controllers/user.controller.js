import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;//Getting from protectRoute

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");//fetch all user in our database but not
                                                                                                    // one equal to this userID.
                                                                                                    // not selecting password.

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};