import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  portfolio_ProjectTitle: { type: String, required: true },
  ProjectDescription: { type: String, required: true },
  Upload_ProjectURL: { type: [String], required: true },
});

const profileSchema = new mongoose.Schema(
  {
    UserId: { type: String, required: true, unique: true },

    ProfileName: { type: String, required: true, trim: true },
    About: { type: String, required: true },

    Skill: { type: [String], required: true },
    Tools: { type: [String], required: true },
    AddLinks: { type: [String], default: [] },

    Portfolio: { type: [portfolioSchema], default: [] },
  },
  { timestamps: true }
);

const ClientProfilemodel = mongoose.model("CLientProfile", profileSchema);
export default ClientProfilemodel;