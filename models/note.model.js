const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Fixed typo
    status: { type: Boolean, required: true, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    versionKey: false,
    timestamps: true, // Fixed timestamp option
  }
);

const noteModel = mongoose.model("Note", NoteSchema);

module.exports = noteModel;
