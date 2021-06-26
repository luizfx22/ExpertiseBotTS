import { Client, Message } from "discord.js";
import { config } from "dotenv";

config();

class Bot {
	constructor() {
		this.listen();
	}

	private listen(): Promise<string> {
		const client = new Client();
		client.on("message", (message: Message) => {});
		return client.login(process.env.TOKEN);
	}
}

export default new Bot();
