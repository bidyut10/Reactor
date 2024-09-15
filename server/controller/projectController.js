const projectModel = require('../models/projectModel');

// Create Project
const createProject = async (req, res) => {
    try {
        const { title } = req.body;
        const newProject = await projectModel.create({ title, createdBy: req.userId });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            projectId: newProject._id
        });
    } catch (error) {
        console.error("Error in createProject:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get Projects
const getProjects = async (req, res) => {
    try {
        const projects = await projectModel.find({ createdBy: req.userId });

        res.status(200).json({ success: true, projects });
    } catch (error) {
        console.error("Error in getProjects:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Edit Project (Ownership checked via middleware)
const editProject = async (req, res) => {
    try {
        const { title } = req.body;
        const projectId = req.params.projectId;

        const project = await projectModel.findByIdAndUpdate(projectId, { title }, { new: true });

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        console.error("Error in editProject:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete Project (Ownership checked via middleware)
const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        await projectModel.findByIdAndDelete(projectId);

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteProject:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { createProject, getProjects, editProject, deleteProject };
