import express from "express";
import {
  createfreelenceProfile,
  updatefreelenceProfile,
  addfreelancerPortfolioItem,
  deletefreelancerPortfolioItem,
  updatePortfolioItemById,
  deletefreelenceProfile,
  getProfileById
} from "../controllers/freelanceprofilecontroller.js";

const router = express.Router();

router.post("/create", createfreelenceProfile);
router.get("/user/:userId",  getProfileById);
router.put("/update/:id", updatefreelenceProfile);

router.post("/portfolio/add/:id", addfreelancerPortfolioItem);
router.put("/portfolio/update/:profileId/:portfolioId", updatePortfolioItemById);
router.delete("/portfolio/delete/:profileId/:portfolioId", deletefreelancerPortfolioItem);


router.delete("/deletefreelenceProfile/:id",deletefreelenceProfile)
export default router;
