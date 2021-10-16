// discord_id:407307596224004127
// game_name:"Wallpaper Engine"
// last_time_played:1054
// max_time_played:1054
// created_at:"2021-04-09T23:15:42.939906+00:00"
// updated_at:"2021-06-10T21:23:54.038722+00:00"

import mongoose, { Schema } from "mongoose";
import { Playtime } from "../types/playtime";

const records = new Schema<Playtime>({
	guild_id: String,
	discord_id: String,
	game_name: String,
	last_time_played: Number,
	max_time_played: Number,
	created_at: String,
	updated_at: String,
});

export default mongoose.model<Playtime>("records", records);
