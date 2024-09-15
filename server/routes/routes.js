const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeProjectOwnership } = require('../middleware/authMiddleware');
const { createProject, getProjects, editProject, deleteProject } = require('../controllers/projectController');
const { signUpUser, loginUser } = require('../controllers/userController');

// Routes
router.post("/signup", signUpUser);
router.post("/login", loginUser);

// Routes
router.post("/createProject", authenticateToken, createProject);
router.get("/getProjects", authenticateToken, getProjects);
router.put("/editProject/:projectId", authenticateToken, authorizeProjectOwnership, editProject);
router.delete("/deleteProject/:projectId", authenticateToken, authorizeProjectOwnership, deleteProject);

module.exports = router;
