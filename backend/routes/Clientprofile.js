import express from "express";
import { addClientPortfolioItem, createclientProfile, deleteClientPortfolioItem, getClientProfileByUser, updateClientItemById, updateClientProfile,deleteCLientProfile } from "../controllers/Clientprofile";

const router = express.Router();

router.post("/clientprofilecreate",createclientProfile);
router.get("/clientuser/:userId",getClientProfileByUser);
router.put("/clientprofileupdate/:id",updateClientProfile);

router.post("/clientportfolio/add/:id",addClientPortfolioItem);
router.put("/clientportfolio/update/:profileId/:portfolioId",updateClientItemById);
router.delete("/clientportfolio/delete/:profileId/:portfolioId",deleteClientPortfolioItem);


router.delete("/deleteclientProfile/:id",deleteCLientProfile)
export default router;
