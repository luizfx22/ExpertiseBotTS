import { Client } from "discord.js";
import { config } from "dotenv";
import handler from "commands/handler";
import ora from "ora";

config();

class Bot {
	private initMessage;

	constructor() {
		console.clear();
		this.initMessage = ora("Starting...").start();
		this.listen();
	}

	private async listen(): Promise<string> {
		const client = new Client();
		const status = await client.login(process.env.BOT_TOKEN);
		this.initMessage.succeed(`Connected as '${client.user?.username}'`);

		client.on("message", handler);

		return status;
	}
}

export default new Bot();
