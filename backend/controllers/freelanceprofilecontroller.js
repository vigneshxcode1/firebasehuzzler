import freelanceProfilemodel from "../models/freelenceprofilemodel.js";

// Create new profile (no user check)
export const createfreelenceProfile = async (req, res) => {
  try {
    const profile = await freelanceProfilemodel.create(req.body);
    return res.status(201).json({ success: true, data: profile });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await freelanceProfilemodel.findById(req.params.id);
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    return res.status(200).json({ success: true, data: profile });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update profile by ID
export const updatefreelenceProfile = async (req, res) => {
  try {
    const updated = await freelanceProfilemodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Add portfolio item by profile ID
export const addfreelancerPortfolioItem = async (req, res) => {
  try {
    const updated = await freelanceProfilemodel.findByIdAndUpdate(
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
export const updatePortfolioItemById = async (req, res) => {
  try {
    const { profileId, portfolioId } = req.params;
    const updated = await freelanceProfilemodel.findOneAndUpdate(
      { _id: profileId, "Portfolio._id": portfolioId },
      {
        $set: {
          "Portfolio.$.portfolio_ProjectTitle": req.body.portfolio_ProjectTitle,
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

// Delete portfolio item by ID
export const deletefreelancerPortfolioItem = async (req, res) => {
  try {
    const updated = await freelanceProfilemodel.findByIdAndUpdate(
      req.params.profileId,
      { $pull: { Portfolio: { _id: req.params.portfolioId } } },
      { new: true }
    );
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete profile by ID
export const deletefreelenceProfile = async (req, res) => {
  try {
    const deletedProfile = await freelanceProfilemodel.findByIdAndDelete(req.params.id);
    if (!deletedProfile) return res.status(404).json({ success: false, message: "Profile not found" });
    return res.status(200).json({ success: true, message: "Profile deleted successfully", data: deletedProfile });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
