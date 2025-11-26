const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JourneySchema = new Schema({
  github_id: { type: String, required: true, index: true, unique: true },
  profile: { type: Schema.Types.Mixed, default: {} },
  repos: { type: [Schema.Types.Mixed], default: [] },
  languages: { type: Schema.Types.Mixed, default: {} },
  stats: { type: Schema.Types.Mixed, default: {} },
  last_updated: { type: Date, default: Date.now },
  update_count: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Journey', JourneySchema);
