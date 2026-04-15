import mongoose from "mongoose";

const betPickSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    match: { type: String, required: true },
    market: { type: String, required: true },
    league: { type: String, required: true },
    sport: { type: String, required: true },
    kickoff: { type: String, required: true },
    label: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const betSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    picks: { type: [betPickSchema], default: [] },
    picksCount: { type: Number, required: true },
    betType: { type: String, enum: ["single", "multiple"], required: true },
    stake: { type: Number, required: true },
    totalStake: { type: Number, required: true },
    totalOdds: { type: Number, required: true },
    potentialReturn: { type: Number, required: true },
    bonusRate: { type: Number, required: true, default: 0 },
    bonusAmount: { type: Number, required: true, default: 0 },
    totalPayout: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

export const Bet = mongoose.models.Bet || mongoose.model("Bet", betSchema);
