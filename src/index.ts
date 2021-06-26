import { Client, Message } from "discord.js";
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

		client.user?.setActivity({
			name: "%help",
			type: "COMPETING",
		});

		client.on("message", (message: Message) => {
			handler(message, client);
		});

		return status;
	}
}

export default new Bot();
