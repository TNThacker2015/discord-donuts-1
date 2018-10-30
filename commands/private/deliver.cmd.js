const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo } = require("../../sequelize");
const { canCook } = require("../../permissions");
const { channels: { deliveryChannel } } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("deliver")
		.setDescription("Use this to deliver cooked donuts.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (message.channel.id !== deliveryChannel) return message.channel.send("You can only use this command in the delivery channel");
			if (!args[0]) return message.channel.send("You need to specify an order");

			const order = await Orders.findOne({ where: { id: args.shift() } });
			const worker = await WorkerInfo.findOne({ where: { id: message.author.id } });

			if (!order) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Deliver")
						.setDescription("Couldn't find that order!")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			if (order.status > 3) return message.channel.send("Whoops, this order is finished, maybe someone else delivered it? :wink:");
			if (order.status !== 3) return message.channel.send("This order has not been cooked yet");

			await order.update({ status: 4 });

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Deliver")
					.setDescription("Order information sent to the DMs!")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4e9.png");

			message.reply(embed);

			const invite = await client.channels.get(order.get("channel")).createInvite({
				maxAge: 86400,
				maxUses: 1,
				unique: true,
			});

			const orderEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Delivery Info")
					.addField("Ticket Description", order.get("description"))
					.addField("User Information", `${client.users.get(order.user).tag} (${order.get("user")}) in #${client.channels.get(order.get("channel").name)} (${order.get("channel")}).`)
					.addField("Cook's Image", order.get("url"));

			await message.author.send(orderEmbed);
			await message.author.send(invite.url);

			if (!worker) {
				await WorkerInfo.create({
					id: message.author.id,
					cooks: 0,
					delivers: 1,
					lastCook: 0,
					lastDeliver: Date.now(),
				});
			} else {
				worker.update({ delivers: worker.delivers + 1, lastDeliver: Date.now() });
			}
		});
