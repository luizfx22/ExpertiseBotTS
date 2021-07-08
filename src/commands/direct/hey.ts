import { Message } from "discord.js";

export const command = {
	name: "hey",
	async execute(ctx: Message): Promise<any> {
		await ctx.channel.send("Sup bro");
	},
};
