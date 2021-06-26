import { Message } from "discord.js";

export const command = {
	name: "ban",
	description: "Used to punish an user with bad behavior",
	async execute(ctx: Message): Promise<any> {
		await ctx.channel.send("Hey");
	},
};
