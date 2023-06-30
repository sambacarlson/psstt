import mongoose from "mongoose";
const DailyCheckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: String,
    required: true,
  },
  loginTime: {
    type: Number,
    required: true,
  },
  logoutTime: {
    type: Number,
  },
  timers: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Timer' }],
});

module.exports = mongoose.models
  ? mongoose.models.DailyCheck || mongoose.model("DailyCheck", DailyCheckSchema)
  : mongoose.model("DialyCheck", DailyCheckSchema);
