const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("servers")
		.setDescription("Info about the bots servers and shards.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Number of servers")
					.setDescription("Information on the number of servers of this bot.")
					.addField("Total servers", client.guilds.size)
					// TODO: maybe add shard stuff :shrug:
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");
			message.channel.send(embed);
		});
