import mongoose from "mongoose";
import Playtime from "./models/playtime";

mongoose.connect(process.env.MONGO_URI!);

export default { Playtime, mongoose };
