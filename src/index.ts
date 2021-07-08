import { Client, Message } from "discord.js";
import { config } from "dotenv";
import handler from "commands/handler";
import ora from "ora";
import settings from "./settings.json";

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

		const attentionListLength = settings.activities.length;
		let attentionItemNow = 0;
		setInterval(() => {
			const opts = {
				name: settings.activities[attentionItemNow].name.replace(":prefix:", process.env.BOT_PREFIX || "%"),
				type: settings.activities[attentionItemNow].type || "PLAYING",
			};

			client.user?.setActivity(opts as any);

			if (attentionItemNow < attentionListLength - 1) {
				attentionItemNow++;
			} else if (attentionItemNow === attentionListLength - 1) {
				attentionItemNow = 0;
			}
		}, settings.activityInterval * 1000);

		client.on("message", (message: Message) => {
			handler(message, client);
		});

		return status;
	}
}

export default new Bot();
