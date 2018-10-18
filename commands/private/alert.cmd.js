const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { isBotOwner } = require("../../permissions");

const { kitchenChannel } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("alert")
		.setDescription("Use this to send an alert to kitchen.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			if (args.length < 1) {
				const embed =
					new DDEmbed(client)
						.setStyle("colorful")
						.setTitle("Alert")
						.setDescription("You did not provide anything for me to send!")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				message.channel.send(embed);
				return;
			}

			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Alert")
					.setDescription(args.join(" "))
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2757.png");

			message.guild.channels.get(kitchenChannel).send(embed);
		});
