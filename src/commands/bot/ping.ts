import { Message } from "discord.js";

export const command = {
	name: "ping",
	async execute(ctx: Message): Promise<any> {
		return ctx.channel.send("Pong!");
	},
};
