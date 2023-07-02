import mongoose from "mongoose";
import Timer from 'modals/Timers'
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// DailyCheckSchema.virtual("timers", {
//   ref: "Timer",
//   foreignField: "dailyCheckId",
//   localField: "_id",
// });

// DailyCheckSchema.pre(/^find/, function (next) {
//   this.populate("timers");
//   next();
// });

module.exports = mongoose.models
  ? mongoose.models.DailyCheck || mongoose.model("DailyCheck", DailyCheckSchema)
  : mongoose.model("DialyCheck", DailyCheckSchema);
