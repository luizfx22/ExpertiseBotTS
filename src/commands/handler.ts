import { Client, Message, MessageEmbed } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import Errors from "./messages.json";

config();

class CommandHandler {
	public client: Client | any;
	private prefix = process.env.BOT_PREFIX || "%";
	private guildCommandsList: Record<
		string,
		{
			name: string;
			description?: string;
			execute: (ctx: Message) => Promise<void>;
		}
	> = {};
	private directCommandsList: Record<
		string,
		{
			name: string;
			description?: string;
			execute: (ctx: Message) => Promise<void>;
		}
	> = {};

	constructor() {
		const guildCommands = this.getCommands(path.join(__dirname, "guild"));
		const directCommands = this.getCommands(path.join(__dirname, "direct"));

		for (const command of guildCommands) {
			try {
				const commandInst = { ...require(command) };
				const name = commandInst.command.name;
				this.guildCommandsList[name] = commandInst.command;
			} catch (error) {
				console.error(error);
			}
		}

		for (const command of directCommands) {
			try {
				const commandInst = { ...require(command) };
				const name = commandInst.command.name;
				this.directCommandsList[name] = commandInst.command;
			} catch (error) {
				console.error(error);
			}
		}
	}

	public async handleGuildMessage(message: Message): Promise<void> {
		if (!message) return;
		if (!message?.content?.startsWith(this.prefix)) return;

		let command = message?.content.split(" ")[0];
		command = command.replace(this.prefix, "");

		if (!command) return;

		if (command === "help") return this.handleGuildHelp(message);

		if (!Object.keys(this.guildCommandsList).includes(command)) {
			const errorEmbed = new MessageEmbed({
				title: Errors["command-not-found"].title,
				color: Errors["command-not-found"].color,
			});

			await message.channel.send(errorEmbed);

			return;
		}

		await this.guildCommandsList[command].execute(message);
	}

	public async handleDirectMessage(message: Message): Promise<void> {
		if (!message) return;

		const command = message?.content;

		if (!Object.keys(this.directCommandsList).includes(command)) {
			const errorEmbed = new MessageEmbed({
				title: Errors["command-not-found"].title,
				color: Errors["command-not-found"].color,
			});

			await message.channel.send(errorEmbed);

			return;
		}

		await this.directCommandsList[command].execute(message);
	}

	public async handleGuildHelp(message: Message): Promise<void> {
		const commandsAvailable = Object.keys(this.guildCommandsList);
		const helpEmbed = new MessageEmbed();

		for (const command of commandsAvailable) {
			helpEmbed.addField(command, this.guildCommandsList[command].description);
		}

		await message.channel.send(helpEmbed);
	}

	private getCommands(commandsPath: string): Array<string> {
		const files = fs.readdirSync(commandsPath);
		return files.map((file) => path.join(commandsPath, file));
	}
}

const ch = new CommandHandler();

export default function handler(message: Message, client: Client): any {
	if (message.author.id === client.user?.id) return false;
	ch.client = client;

	if (message.channel.type === "dm") return ch.handleDirectMessage(message);

	return ch.handleGuildMessage(message);
}
