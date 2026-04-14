import mongoose, { Schema, Types } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: String,

    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
      index: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    participants: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    assignedTo: {
      type: Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },


    deadline: Date,

    messages: [
      {
        senderId: {
          type: Types.ObjectId,
          ref: "User",
          required: true,
        },

        type: {
          type: String,
          enum: ["text", "file", "system"],
          default: "text",
        },

        message: String,
        attachments: [String],


        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    lastMessage: {
      message: String,
      senderId: { type: Types.ObjectId, ref: "User" },
      createdAt: Date,
    },


    attachments: [String],

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);