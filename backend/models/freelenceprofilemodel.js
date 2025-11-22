import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  portfolio_ProjectTitle: { type: String, required: true },
  ProjectDescription: { type: String, required: true },
  Upload_ProjectURL: { type: [String], required: true },
});

const profileSchema = new mongoose.Schema(
  {
    UserId: {  type: mongoose.Schema.Types.ObjectId, ref: 'freelanceprofileid', unique: true },
    ProfileName: { type: String, required: true, trim: true },
    About: { type: String, required: true },

    Skill: { type: [String], required: true },
    Tools: { type: [String], required: true },
    AddLinks: { type: [String], default: [] },

    Portfolio: { type: [portfolioSchema], default: [] },
  },
  { timestamps: true }
);

const FreelanceProfilemodel = mongoose.model("freelanceProfile", profileSchema);
export default FreelanceProfilemodel;