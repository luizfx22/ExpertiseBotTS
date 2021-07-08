import { Message, MessageEmbed } from "discord.js";
import axios from "axios";
import { DateTime } from "luxon";

const apiURI = "https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalGeralApi";

export const command = {
	name: "covid",
	description: "This command is responsible for showing the latest numbers of covid in Brasil today",
	async execute(ctx: Message): Promise<any> {
		await ctx.delete();

		const { data } = await axios.get(apiURI);

		const response = new MessageEmbed();

		response.setColor(0xffc2ab);
		response.setTitle(`Casos Covid Brasil (${DateTime.fromISO(data.dt_updated).toFormat("dd/MM/yyyy")})`);
		response.addField("Mortes", Number(data.obitos.total).toLocaleString("pt-BR"), true);
		response.addField("Mortes (hoje)", Number(data.obitos.novos).toLocaleString("pt-BR"), true);
		response.addField("Casos", Number(data.confirmados.total).toLocaleString("pt-BR"), true);
		response.addField("Casos (hoje)", Number(data.confirmados.novos).toLocaleString("pt-BR"), true);
		response.addField("Recuperados", Number(data.confirmados.recuperados).toLocaleString("pt-BR"), true);
		response.setFooter(
			`Requested by ${ctx.author.username} @ ${DateTime.fromJSDate(ctx.createdAt).toFormat("dd/MM/yyyy - hh:mm:ss")}`
		);
		response.setURL("https://covid.saude.gov.br");

		await ctx.reply(response);

		// {
		// 	country: 'Brazil',
		// 	cases: 1616975,
		// 	confirmed: 18909887,
		// 	deaths: 528540,
		// 	recovered: 16763522,
		// 	updated_at: '2021-07-07T23:21:36.000Z'
		// }

		return;
	},
};
