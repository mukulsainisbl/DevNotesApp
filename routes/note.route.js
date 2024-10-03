const express = require("express");
const noteModel = require("../models/note.model");
const UserModel = require("../models/user.model");
const userRouter = require("./user.route");
const noteRouter = express.Router();

noteRouter.get("/notes", async (req, res) => {
    try {
      // Find the user by ID
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

  
      // Fetch notes associated with the logged-in user
      const notes = await noteModel.find({ userId: req.user._id });
  
      // Respond with fetched notes
      res
        .status(200)
        .json({ msg: `${user.username}, your notes have been fetched successfully.`, notes });
    } catch (error) {
      res.status(500).json({ msg: "Error in fetching notes", error });
    }
  });
  

noteRouter.post("/create", async (req, res) => {
  try {
    // Find the user by their ID
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Destructure the note details from the request body
    const { title, content, status } = req.body;

    // Create a new note
    let note = new noteModel({
      title,
      content,
      status,
      userId: req.user._id, // Use req.user._id as userId
    });

    // Save the note to the database
    await note.save();

    // Respond with success
    res
      .status(201)
      .json({
        msg: `${user.username}, your note has been created successfully.`,
      });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

noteRouter.put("/update/:id", async (req, res) => {
    let userId = req.user._id; // Logged-in user's ID
    let payload = req.body;
    let noteId = req.params.id; // Note ID from the URL
  
    try {
      // Find the note by its ID
      let findNote = await noteModel.findOne({ _id: noteId });
      if (!findNote) {
        return res.status(404).json({ msg: "Note not found" });
      }
  
      // Check if the logged-in user is the owner of the note
      if (findNote.userId.toString() !== userId.toString()) {
        return res.status(403).json({ msg: "You are not authorized to update this note" });
      }
  
      // Update the note
      let updatedNote = await noteModel.findByIdAndUpdate(
        { _id: noteId },
        payload,
        { new: true } // Return the updated document
      );
  
      // Find the user for the response message
      const user = await UserModel.findById(userId);
      res.status(200).json({ msg: `${user.username}, your note has been updated successfully`, updatedNote });
    } catch (error) {
      res.status(500).json({ msg: "Error updating note", error });
    }
  });


  noteRouter.delete("/delete/:id", async (req, res) => {
    let userId = req.user._id;  // The ID of the logged-in user
    let noteId = req.params.id; // The ID of the note to be deleted
  
    try {
      // Find the note by its ID
      const note = await noteModel.findById(noteId);
  
      if (!note) {
        return res.status(404).json({ msg: "Note not found" });
      }
  
      // Check if the logged-in user is the owner of the note
      if (note.userId.toString() !== userId.toString()) {
        return res.status(403).json({ msg: "You are not authorized to delete this note" });
      }
  
      // Delete the note
      await noteModel.findByIdAndDelete(noteId);
  
      // Respond with a success message
      res.status(200).json({ msg: "Note deleted successfully" });
  
    } catch (error) {
      res.status(500).json({ msg: "Server error", error });
    }
  });
  
  
module.exports = noteRouter;
