const Discord = require('discord.js');
require('moment');

module.exports = {
	name: 'userinfo',
	info: 'Info about User',
	desc: 'Shows a users information',
	aliases: [''],
	usage: '',
	args: false,
	guildOnly: true,
	ownerOnly: false,
	group: 'client/moderation/server',
	perm: 'ADMINISTRATOR',
	perms: [],
	cooldown: 2,

	/** - - Code to Run - - */
	async execute(client, message) {
		// Set Variables
		const target = message.mentions.users.first() || message.author;
		const guildTarget = message.mentions.members.first() || message.member;
		let nickname = message.member.nickname;
		if (!nickname) nickname = "No guild nickname.";

		// Send embed
		const embed = new Discord.RichEmbed()
			.setTitle(`This is **${target.username}'s information`)
			.setThumbnail(target.avatarURL)
<<<<<<< HEAD
			.addField("Full Username", target.tag, true)
			.addField("ID", target.id, true)
			.addField("Nickname", nickname, true)
			.addField("Roles", guildTarget.roles.toString())
			.addField("Joined At", guildTarget.joinedAt.format('ll'))
			.addField("Account Created", target.createdAt.format('ll'))
			.setColor(client.color.basic('blue'));
		return message.channel.send(embed);
=======
			.addField("Nickname", nickname, true)
			.addField("ID", `\`${target.id}\``, true)
			.addField("Roles", "```<UNDEFINED>```")
			.addBlankField()
			.addField("Presence", " ")
			.addBlankField()
			.addField("Created At", target.createdAt)
			.addField("Joined At", guildTarget.joinedAt);

		message.channel.send(embed);
>>>>>>> 05b79bc3111378079f8b69d5f266a9a7329825d8
	},
};