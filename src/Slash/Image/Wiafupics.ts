import { Slash } from '../../interfaces';
import fetch from 'node-fetch';

export const slash: Slash = {
	name: 'waifupics',
	description: 'Get an images from waifu.pics',
	testOnly: false,
	options: [
		{
			type: 3,
			name: 'endpoint',
			description: 'Type that you want. Leave it blank for random type.',
			required: false,
		},
	],
	run: async (client, interaction, args) => {
		if (interaction.channel.type === 'GUILD_TEXT' && !interaction.channel.nsfw)
			return interaction.followUp({
				content: `Not an NSFW Channel!`,
				ephemeral: true,
			});
		let [endpoint] = args;
		if (!endpoint) endpoint = 'lewd';
		fetch(`https://nekos.life/api/v2/img/${endpoint}`)
			.then((res) => res.json())
			.then((body) => {
				interaction.followUp({ content: `${body.url}` });
			})
			.catch((err) => {
				console.log(err);
			});
	},
};
