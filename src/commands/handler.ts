import { Message } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path/posix";

config();

class CommandHandler {
	private prefix = process.env.BOT_PREFIX || "%";
	private commandList: Record<string, any> = {};

	constructor() {
		const commands = this.getCommands(path.join(__dirname, "bot"));
		for (const command of commands) {
			const commandInst = { ...require(command) };
			const name = commandInst.command.name;
			this.commandList[name] = commandInst.command;
		}
	}

	public async handleMessage(message: Message): Promise<void> {
		if (!message) return;
		if (!message?.content?.startsWith(this.prefix)) return;

		let command = message?.content.split(" ")[0];
		command = command.replace(this.prefix, "");

		if (!command) return;

		if (!Object.keys(this.commandList).includes(command)) {
			await message.channel.send("No ecziste!");
			return;
		}

		this.commandList[command].execute(message);
	}

	private getCommands(commandsPath: string): Array<string> {
		const files = fs.readdirSync(commandsPath);
		return files.map((file) => path.join(commandsPath, file));
	}
}

const ch = new CommandHandler();

export default function handler(message: Message): void {
	ch.handleMessage(message);
}
