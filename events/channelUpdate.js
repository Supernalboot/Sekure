/*
 *   Copyright (c) 2020 Dimitri Lambrou
 *   All rights reserved.
 *   Unauthorized copying of this file, via any medium is strictly prohibited. Proprietary and confidential
 */
const Discord = require('discord.js');
const read = require("../functions/databaseRead");

module.exports = async (client, oldChannel, newChannel) => {
	// Get guild variable
	const guild = oldChannel.guild;

	// Fetch latest audit, to make sure we will fetch this specific task
	const audit = await guild.fetchAuditLogs({ limit: 1 });
	const entry = await audit.entries.first();

	// Collect our Doc.
	const doc = await read(guild.id, 'sekure_servers', undefined, client);

	// Check if guild has enabled this module
	if (doc.modules.channelUpdate == false) return;

	// Grab log channel
	const logChannel = doc.channels.serverLogID;
	if (!logChannel) return;

	// Stop bots from triggering event to reduce spam
	if (entry.executor.bot) return;

	// Fill out embed information
	const embed = await new Discord.RichEmbed()
		.setTitle('**Channel Updated**')
		.addField('Channel', `${newChannel}\n\`${newChannel.id}\``, true)
		.addField('Channel Type', `\`${newChannel.type}\``, true)
		.addField('Updated by', `\`\`${entry.executor.tag}\`\`\n\`${entry.executor.id}\``, true)
		.setFooter('Time of Action')
		.setTimestamp(Date.now())
		.setColor(client.color.basic('orange'));

	// If a reason was given, add it as description
	if (entry.reason) await embed.setDescription(`**Reason:** ${entry.reason}`);

	// Send embed
	return logChannel.send(embed);
};