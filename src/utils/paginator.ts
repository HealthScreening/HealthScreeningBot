import {
  MessageActionRow,
  MessageEmbed,
  MessageButton,
  CommandInteraction
} from "discord.js";

/**
 * Creates a pagination embed
 * @param {CommandInteraction} interaction
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
export default async function (interaction: CommandInteraction, pages: MessageEmbed[], buttonList: MessageButton[], timeout: number = 120000) {
  if (!pages){
    throw new Error("No pages for paginationEmbed!.");
  }
  if (!buttonList){
    buttonList = [
      new MessageButton()
        .setCustomId('tobeginning')
        .setStyle('PRIMARY')
        .setEmoji('921073324094804038'),
      new MessageButton()
        .setCustomId('last')
        .setStyle('PRIMARY')
        .setEmoji('921073293572853803'),
      new MessageButton()
        .setCustomId('next')
        .setEmoji('921073355073933313')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('toend')
        .setEmoji('921073383955922995')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('discard')
        .setEmoji('921074968660414485')
        .setStyle('DANGER'),
    ]
  }
  if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
    throw new Error(
      "Link buttons are not supported!"
    );

  let page = 0;

  const row = new MessageActionRow().addComponents(buttonList);

  //has the interaction already been deferred? If not, defer the reply.
  if (interaction.deferred == false){
    await interaction.deferReply();
  }

  const curPage = await interaction.editReply({
    embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
    components: [row],fetchReply: true,
  });

  const filter = (i) =>
    i.customId === buttonList[0].customId ||
    i.customId === buttonList[1].customId ||
    i.customId === buttonList[2].customId ||
    i.customId === buttonList[3].customId ||
    i.customId === buttonList[4].customId;
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].customId:
        page = 0;
        break;
      case buttonList[1].customId:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[2].customId:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case buttonList[3].customId:
        page = pages.length - 1;
        break;
      case buttonList[4].customId:
        await interaction.deleteReply();
        return;

      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", () => {
    if (!curPage.deleted) {
      const disabledRow = new MessageActionRow().addComponents(
        buttonList[0].setDisabled(true),
        buttonList[1].setDisabled(true),
        buttonList[2].setDisabled(true),
          buttonList[3].setDisabled(true),
          buttonList[4].setDisabled(true)

      );
      curPage.edit({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [disabledRow],
      });
    }
  });

  return curPage;
};
