// import express from "express";
// import {
//     requestToJoin,
//     getProjectJoinRequests,
//     getUserJoinRequests,
//     handleJoinRequest,
//     getAllJoinRequests
// } from "../controllers/joinRequest.js";
// import { authenticateToken } from "../middleware/auth.js";

// const router = express.Router();

// // All routes require authentication
// router.use(authenticateToken);

// router.post("/", requestToJoin);
// router.get("/user/my-requests", getUserJoinRequests);
// router.get("/project/:projectId", getProjectJoinRequests);
// router.put("/:requestId", handleJoinRequest);
// router.get("/", getAllJoinRequests);

// export default router;

import express from "express";
import {
  requestToJoin,
  getProjectJoinRequests,
  getUserJoinRequests,
  handleJoinRequest,
  getAllJoinRequests
} from "../controllers/joinRequest.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);   // ✅ use protect

router.post("/", requestToJoin);
router.get("/user/my-requests", getUserJoinRequests);
router.get("/project/:projectId", getProjectJoinRequests);
router.put("/:requestId", handleJoinRequest);
router.get("/", getAllJoinRequests);

export default router;
