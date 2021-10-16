import { Message, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";

export const command = {
	name: "whois",
	description: "Show who has the id in the server! May take a while if the server has too many users!",
	async execute(ctx: Message): Promise<any> {
		await ctx.channel.send(":thinking: Let me see! Wait a moment...");

		const messageContent = ctx
			.toString()
			.replace(`${process.env?.BOT_PREFIX || "%"}${this.name}`, "")
			.trim();

		const guildMember = ctx.guild?.members.resolve(messageContent);

		if (!guildMember) {
			const embed = new MessageEmbed();
			embed.setColor(0xff0000);
			embed.setTitle(`❌ User not found!`);

			return ctx.reply(embed);
		}

		const embed = new MessageEmbed();
		embed.setColor(0x05c4bf);
		embed.setTitle(`WhoIS?`);
		embed.addField("Username", `${guildMember?.user?.username}#${guildMember?.user?.discriminator}`, true);
		embed.addField("Aka", guildMember?.nickname, true);
		embed.addField("Bot", `${guildMember?.user.bot ? "YES" : "NO"}`, true);
		embed.setFooter(
			`Requested by ${ctx.author.username} @ ${DateTime.fromJSDate(ctx.createdAt).toFormat("dd/MM/yyyy - hh:mm:ss")}`
		);

		ctx.reply(embed);

		//
	},
};
