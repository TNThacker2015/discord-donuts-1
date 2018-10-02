const { RichEmbed } = require('discord.js')

const { Blacklist, Orders, Op } = require('../sequelize')

const { generateID, canCook } = require('../helpers')

module.exports = {
  name: 'claim',
  permissions: canCook,
  description: 'Use this to claim cooked donuts',
  async execute (message,args,client) {
    if (!canCook(message.member)) return

    const order = await Orders.findOne({ where: { id: args.shift(), claimer: null } })
    if (!order) message.reply('Couldn\'t find that order or it has already been claimed')

    await order.update({ status: 1, claimer: message.author.id })

    await client.users.get(order.get('user')).send(`Guess what? Your ticket has now been claimed by **${message.author.username}**! It should be cooked shortly.`)

    message.reply('You have claimed the order')
  }
}