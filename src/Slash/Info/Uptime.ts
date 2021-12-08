import pretty from 'pretty-ms';
import { MessageEmbed } from 'discord.js';
import { Slash } from '../../Interfaces';

export const slash: Slash = {
	name: 'uptime',
	description: 'Shows client uptime',
	testOnly: false,
	options: [],
	run: async (client, interaction, args) => {
		const embed = new MessageEmbed()
			.setDescription(`🕘 Uptime : ${pretty(client.uptime)}`)
			.setColor('LUMINOUS_VIVID_PINK');
		interaction.followUp({ embeds: [embed] });
	},
};
