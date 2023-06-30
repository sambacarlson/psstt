import mongoose from "mongoose";
const TimerSchema = new mongoose.Schema({
  dailyCheckId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'DailyCheck'
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  estimatedTime: Number,
  startTime: {
    type: Number,
    default: new Date()
  },
  finishTime: {
    type: Number,
  },
  screenshots: [String],
});

module.exports = mongoose.models
  ? mongoose.models.Timer || mongoose.model("Timer", TimerSchema)
  : mongoose.model("Timer", TimerSchema);
