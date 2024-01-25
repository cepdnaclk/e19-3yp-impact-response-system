import mongoose, { Document, Schema } from "mongoose";
import { ImpactPlayer } from "../models/session.model";

interface SessionDocument extends Document {
  teamId: string;
  sessionId: string;
  sessionName: string;
  createdAt: number;
  updatedAt: number;
  impactHistory: ImpactPlayer[];
}

const sessionSchema = new Schema({
  teamId: String,
  sessionId: String,
  sessionName: String,
  createdAt: Number,
  updatedAt: Number,
  impactHistory: [
    {
      jerseyId: Number,
      impact: [
        {
          magnitude: Number,
          direction: String,
          timestamp: Number,
          isConcussion: Boolean,
        },
      ],
    },
  ],
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
