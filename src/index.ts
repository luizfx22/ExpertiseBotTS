import { Client, Message } from "discord.js";
import handler from "./commands/handler";
import UserStatusHandler from "./events/user-status";
import ora from "ora";

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
			type: "LISTENING",
		});

		client.on("message", (message: Message) => {
			handler(message, client);
		});

		client.on("presenceUpdate", (lastPresence, actualPresence) => {
			new UserStatusHandler(client, lastPresence, actualPresence);
		});

		return status;
	}
}

export default new Bot();
