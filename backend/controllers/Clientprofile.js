import ClientProfilemodel from "../models/Clientprofile"

// Create new profile (one per user)
export const createclientProfile = async (req, res) => {
  try {
    const { UserId } = req.body;

    const existing = await ClientProfilemodel.findOne({ UserId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user",
      });
    }

    const profile = await ClientProfilemodel.create(req.body);

    return res.status(201).json({ success: true, data: profile });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get profile by UserId
export const getClientProfileByUser = async (req, res) => {
  try {
    const profile = await ClientProfilemodel.findOne({
      UserId: req.params.userId,
    });

    return res.status(200).json({ success: true, data: profile });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update whole profile
export const updateClientProfile = async (req, res) => {
  try {
    const updated = await ClientProfilemodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Add portfolio item
export const addClientPortfolioItem = async (req, res) => {
  try {
    const updated = await ClientProfilemodel.findByIdAndUpdate(
      req.params.id,
      { $push: { Portfolio: req.body } },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update portfolio item by ID
export const updateClientItemById = async (req, res) => {
  try {
    const { profileId, portfolioId } = req.params;

    const updated = await ClientProfilemodel.findOneAndUpdate(
      { _id: profileId, "Portfolio._id": portfolioId },
      {
        $set: {
          "Portfolio.$.portfolio_ProjectTitle":
            req.body.portfolio_ProjectTitle,
          "Portfolio.$.ProjectDescription": req.body.ProjectDescription,
          "Portfolio.$.Upload_ProjectURL": req.body.Upload_ProjectURL,
        },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete portfolio by id
export const deleteClientPortfolioItem = async (req, res) => {
  try {
    const updated = await ClientProfilemodel.findByIdAndUpdate(
      req.params.profileId,
      { $pull: { Portfolio: { _id: req.params.portfolioId } } },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};


// DELETE FREELANCER PROFILE
export const deleteCLientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProfile = await ClientProfilemodel.findByIdAndDelete(id);

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      data: deletedProfile
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
