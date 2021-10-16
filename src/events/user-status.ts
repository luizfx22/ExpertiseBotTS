import { Activity, Client, Guild, GuildMember, Message, MessageEmbed, Presence, TextChannel } from "discord.js";
import Database from "./../db/database";
import { DateTime } from "luxon";
import _ from "lodash";

class UserStatusHandler {
	public client: Client;

	constructor(client: Client, lastPresence: Presence | undefined, actualPresence: Presence) {
		this.client = client;

		if (lastPresence?.member?.user?.bot || actualPresence?.member?.user?.bot) return;

		for (const activity of lastPresence?.activities || []) {
			const timestamps = { start: activity?.timestamps?.start?.toISOString()!, end: new Date().toISOString() };

			console.log(actualPresence.member?.nickname, "começou", activity.name);

			const diff = DateTime.fromISO(timestamps.end).diff(DateTime.fromISO(timestamps.start), ["seconds"]).toObject();

			const totalSessionPlaytime = Math.floor(diff?.seconds!);

			this.updateUserScore(
				activity,
				actualPresence.member! || lastPresence?.member,
				actualPresence?.guild! || lastPresence?.guild,
				actualPresence?.member?.id || "",
				totalSessionPlaytime
			);
		}
	}

	private async updateUserScore(
		activity: Activity,
		member: GuildMember,
		guild: Guild,
		memberId: string,
		totalSessionPlaytime: number
	): Promise<any> {
		if (memberId === "") return;
		if (activity.type !== "PLAYING") return;

		const recordChannel = guild.channels.resolve("830220208161030164") as TextChannel;

		const dbRes = await Database.Playtime.find({ game_name: activity.name });

		const result = dbRes.filter((o) => o.discord_id === memberId);

		if (result.length < 1) {
			await Database.Playtime.create({
				guild_id: String(guild.id),
				discord_id: String(memberId),
				game_name: activity.name,
				last_time_played: totalSessionPlaytime,
				max_time_played: totalSessionPlaytime,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			});

			const isUserInRecords = await Database.Playtime.find({ discord_id: memberId });

			if (isUserInRecords?.length < 1) {
				await recordChannel?.send(`Olá ${member.toString()}! Você acabou de entrar no placar de recordes do servidor!`);
				await recordChannel?.send(
					`${member.toString()}, o placar de recordes funciona assim, eu fico observando o status de cada um aqui no servidor e conto quanto tempo você ficou com determinado jogo aberto, no final, se você bater seu recorde, te marcarei aqui nesse canal, ok?`
				);
			}

			await recordChannel?.send(
				`Ae ${member.toString()}, você acabou de bater seu próprio recorde jogando ${activity.name}! Parabéns! :clap:`
			);
			await recordChannel?.send(
				`${member.toString()}, atualmente seu recorde com o '${activity.name}' aberto foi de ${this.displayTime(
					totalSessionPlaytime
				)}!`
			);

			return;
		}

		const lastPlayedRecord = result[0]?.max_time_played || 0;

		if (totalSessionPlaytime > lastPlayedRecord) {
			await Database.Playtime.updateOne(
				{ _id: result[0].id },
				{
					guild_id: guild.id,
					last_time_played: totalSessionPlaytime,
					max_time_played: totalSessionPlaytime,
					updated_at: new Date().toISOString(),
				}
			);
		}

		if (totalSessionPlaytime <= lastPlayedRecord) {
			await Database.Playtime.updateOne(
				{ _id: result[0].id },
				{
					guild_id: guild.id,
					last_time_played: totalSessionPlaytime,
					updated_at: new Date().toISOString(),
				}
			);
		}

		const maxRecordOfGameInServer = await Database.Playtime.find({ guild_id: guild.id, game_name: activity.name });

		const whoHasTheMostTimePlayed = _.sortBy(maxRecordOfGameInServer, [["max_time_played", "DESC"]]);

		for (const userRecord of whoHasTheMostTimePlayed) {
			if (userRecord.max_time_played < totalSessionPlaytime && userRecord.last_time_played >= totalSessionPlaytime) {
				const userData = guild.members.resolve(userRecord.discord_id);
				if (!userData) continue;

				let time = this.displayTime(userRecord.max_time_played);
				if (userRecord.max_time_played < 1) continue;
				time = `(${time}) `;

				await recordChannel?.send(
					`Ae ${member.toString()}, você acabou de bater o recorde de ${userData.user.toString()} ${time}jogando ${
						activity.name
					}! Parabéns! :clap:`
				);
			}
		}

		//
	}

	private displayTime(_seconds: number) {
		const seconds = Number(_seconds);
		const d = Math.floor(seconds / (3600 * 24));
		const h = Math.floor((seconds % (3600 * 24)) / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = Math.floor(seconds % 60);

		const dDisplay = d > 0 ? d + (d == 1 ? " dia, " : " dias, ") : "";
		const hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "";
		const mDisplay = m > 0 ? m + (m == 1 ? " minuto e " : " minutos e ") : "";
		const sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " segundos") : "";
		return dDisplay + hDisplay + mDisplay + sDisplay;
	}
}

export default UserStatusHandler;
