/*
 *   Copyright (c) 2020 Dimitri Lambrou
 *   All rights reserved.
 *   Unauthorized copying of this file, via any medium is strictly prohibited. Proprietary and confidential
 */
const Discord = require('discord.js');

module.exports = async (client, oldRole, newRole) => {

	// Get guild variable
	const guild = newRole.guild;

	// Collect our Doc.
	const doc = await read(guild.id, 'sekure_servers', undefined, client);

	// Check if guild has enabled this module
	if (doc.modules.roleUpdate == false) return;

	// Grab log channel
	const logChannel = doc.channels.serverLogID;
	if (!logChannel) return;

	// Fetch latest audit, to make sure we will fetch this specific task
	const audit = await guild.fetchAuditLogs({ limit: 1 });
	const entry = await audit.entries.first();

	// Format bot tag
	let bot = '[Bot]';
	if (!entry.executor.bot) bot = '';

	// Format changes
	const changes = [];
	if (oldRole.name != newRole.name) await changes.push(`--- Name ---\n- ${oldRole.name}\n+ ${newRole.name}`);
	if (oldRole.calculatedPosition != newRole.calculatedPosition) await changes.push(`--- Position ---\n- ${oldRole.calculatedPosition}/${guild.roles.size}\n+ ${newRole.calculatedPosition}/${guild.roles.size}`);
	if (oldRole.color != newRole.color) await changes.push(`--- Color ---\n- ${oldRole.color}\n+ ${newRole.color}`);
	if (oldRole.hoist != newRole.hoist) await changes.push(`--- Hoist ---\n+ ${newRole.hoist}`);
	if (oldRole.mentionable != newRole.mentionable) await changes.push(`--- Mentionable ---\n+ ${newRole.mentionable}`);
	// If no significant changes, return
	if (!changes.length) return;

	// Fill out embed information
	const embed = await new Discord.MessageEmbed()
		.setTitle('**Role Updated**')
		.addField('Role', `${newRole}\n\`${newRole.id}\``, true)
		.addField('Updated by', `\`\`${entry.executor.tag} ${bot}\`\`\n\`${entry.executor.id}\``, true)
		.addField('Changes', `\`\`\`diff\n${changes.join('\n')}\`\`\``)
		.setFooter('Time of Action')
		.setTimestamp(Date.now())
		.setColor(client.color.basic('orange'));

	// If a reason was given, add it as description
	if (entry.reason) await embed.setDescription(`**Reason:** ${entry.reason}`);

	// Send embed
	return logChannel.send(embed);

};

// ╭───────────────┬───────────────┬─────────────────╮
// │ --- Color --- │ --- Hoist --- │ --- Mention --- │
// ├───────────────┼───────────────┼─────────────────┤
// +   10181046    │     TRUE      │      TRUE       │
// -    3447003    │               │                 │
// ╰───────────────┴───────────────┴─────────────────╯