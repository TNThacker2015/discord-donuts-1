const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("wping")
		.setDescription("The webhook ping.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Websocket Ping")
					.setDescription("The ping for the websocket.")
					.addField("Ping", `:ping_pong: Pong! Took \`${message.client.ping.toFixed(0)}ms\`!`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");

			message.channel.send(embed);
		});
