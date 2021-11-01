const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Help Commands',
  aliases: ['h'],
  emoji: '',
  userperm: ['SEND_MESSAGES'],
  botperm: ['SEND_MESSAGES'],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const emojis = {
        database: '💽',
        image: '🖼️',
        info: 'ℹ️',
        learn: '🇯🇵',
        owner: '👑',
        reddit: '<:ame_lewd:901545786091900988>',
        utility: '🔮',
      };
      const directories = [
        ...new Set(client.commands.map((cmd) => cmd.directory)),
      ];
      const formatString = (str) =>
        `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

      const categories = directories.map((dir) => {
        const getCommands = client.commands
          .filter((cmd) => cmd.directory === dir)
          .map((cmd) => {
            return {
              name: cmd.name || 'No Name',
              description: cmd.description || 'No Description Provided',
              emoji: cmd.emoji || '',
            };
          });

        return {
          directory: formatString(dir),
          commands: getCommands,
        };
      });

      const embed = new MessageEmbed()
        .setTitle('Megumi Help Desk')
        .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
        .setDescription(
          'Please choose a category in the dropdown menu!\n\nFor information about usage, or something about commands, You can [Read the Docs](https://github.com/gifaldyazkaa/megumi-dscbot) for more info!'
        )
        .setColor('FUCHSIA');

      const components = (state) => [
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId('help-menu')
            .setPlaceholder('Please select a category')
            .setDisabled(state)
            .addOptions(
              categories.map((cmd) => {
                return {
                  label: cmd.directory,
                  value: cmd.directory.toLowerCase(),
                  description: `Commands from ${cmd.directory} category`,
                  emoji: emojis[cmd.directory.toLowerCase()] || null,
                };
              })
            )
        ),
      ];

      const initialMessage = await message.channel.send({
        embeds: [embed],
        components: components(false),
      });

      const filter = (interaction) => interaction.user.id === message.author.id;

      const collector = message.channel.createMessageComponentCollector({
        filter,
        componentType: 'SELECT_MENU',
      });

      collector.on('collect', (interaction) => {
        const [directory] = interaction.values;
        const category = categories.find(
          (x) => x.directory.toLowerCase() === directory
        );

        const categoryEmbed = new MessageEmbed()
          .setTitle(
            `${emojis[directory.toLowerCase()]} ${formatString(
              directory
            )} Commands`
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: 512 }))
          .setDescription(`Here are the list of commands!`)
          .setColor('FUCHSIA')
          .addFields(
            category.commands.map((cmd) => {
              return {
                name: `${cmd.emoji} \`${cmd.name}\``,
                value: cmd.description,
                inline: true,
              };
            })
          )
          .setTimestamp();

        interaction.update({ embeds: [categoryEmbed] });
      });
    } catch (err) {
      console.log(err);
      message.channel.send({
        content: 'Uh oh! Something unexcepted. Try to running command again!',
      });
    }
  },
};
