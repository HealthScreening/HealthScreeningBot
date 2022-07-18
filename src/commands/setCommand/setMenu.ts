import {
  Collection,
  ActionRowBuilder,
  ActionRowBuilderComponent,
  ButtonBuilder,
  MessageComponentInteraction,
  MessageSelectMenu,
  Snowflake,
  User,
} from "discord.js";

import screeningTypes, {
  screeningTypeType,
} from "@healthscreening/screening-types";

import devicesInSelect from "../../data/devicesInSelect.json";
import {
  HSBMessageComponentInteraction,
  HSBSelectMenuInteraction,
} from "../../discordjs-overrides";
import { AutoDays } from "../../orm/autoDays";
import { AutoUser } from "../../orm/autoUser";
import { Devices, DevicesAttributes } from "../../orm/devices";
import createOrUpdate from "../../utils/createOrUpdate";
import { CustomCollector } from "../../utils/customCollector";
import { ItemType, MessageOptions } from "../../utils/multiMessage";
import { generateProfileEmbed } from "../profile";

export default class SetMenu {
  private readonly user: User;

  private readonly collector: CustomCollector = new CustomCollector("setMenu");

  private readonly autoUserModel: AutoUser | null;

  private readonly autoDaysModel: AutoDays | null;

  private devicesModel: Devices | null;

  public constructor(
    user: User,
    autoUserModel: AutoUser | null,
    autoDaysModel: AutoDays | null,
    devicesModel: Devices | null
  ) {
    this.user = user;
    this.autoUserModel = autoUserModel;
    this.autoDaysModel = autoDaysModel;
    this.devicesModel = devicesModel;
  }

  /* Used in multiple rows */
  private readonly dudButtonBuilder = new ButtonBuilder()
    .setDisabled(true)
    .setLabel("\u200b")
    .setStyle("PRIMARY");

  /* Row #1 */
  private readonly deviceSelect = new MessageSelectMenu()
    .setCustomId("deviceSelect")
    .setPlaceholder("Device to Use")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(devicesInSelect);

  /* Row #2 */
  private readonly typeSelect = new MessageSelectMenu()
    .setCustomId("typeSelect")
    .setPlaceholder("Type of Screening to Generate")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(
      Object.entries(screeningTypes).map(([value, label]) => ({
        label,
        value,
      }))
    );

  /* Row #3 */
  private readonly daySelect = new MessageSelectMenu()
    .setCustomId("daySelect")
    .setPlaceholder("Days to Generate Screening")
    .setMinValues(1)
    .setMaxValues(7)
    .addOptions([
      {
        label: "Monday",
        value: "Monday",
      },
      {
        label: "Tuesday",
        value: "Tuesday",
      },
      {
        label: "Wednesday",
        value: "Wednesday",
      },
      {
        label: "Thursday",
        value: "Thursday",
      },
      {
        label: "Friday",
        value: "Friday",
      },
      {
        label: "Saturday",
        value: "Saturday",
      },
      {
        label: "Sunday",
        value: "Sunday",
      },
    ]);

  /* Row #4 */
  private readonly enableEmailOnly = new ButtonBuilder()
    .setCustomId("enableEmailOnly")
    .setLabel("Enable Email Only")
    .setStyle("SUCCESS");

  private readonly disableEmailOnly = new ButtonBuilder()
    .setCustomId("disableEmailOnly")
    .setLabel("Disable Email Only")
    .setStyle("DANGER");

  private readonly enablePaused = new ButtonBuilder()
    .setCustomId("enablePaused")
    .setLabel("Pause Health Screenings")
    .setStyle("DANGER");

  private readonly disablePaused = new ButtonBuilder()
    .setCustomId("disablePaused")
    .setLabel("Resume Health Screenings")
    .setStyle("SUCCESS");

  private readonly booleanActionRowBuilder = new ActionRowBuilder().addComponents(
    this.enableEmailOnly,
    this.disableEmailOnly,
    new ButtonBuilder(this.dudButtonBuilder.setCustomId("dud1")),
    this.enablePaused,
    this.disablePaused
  );

  /* Row #5 */
  private readonly increment1Hour = new ButtonBuilder()
    .setCustomId("increment1Hour")
    .setLabel("+1 Hour")
    .setStyle("PRIMARY");

  private readonly decrement1Hour = new ButtonBuilder()
    .setCustomId("decrement1Hour")
    .setLabel("-1 Hour")
    .setStyle("PRIMARY");

  private readonly increment5Minutes = new ButtonBuilder()
    .setCustomId("increment5Minutes")
    .setLabel("+5 Minutes")
    .setStyle("PRIMARY");

  private readonly decrement5Minutes = new ButtonBuilder()
    .setCustomId("decrement5Minutes")
    .setLabel("-5 Minutes")
    .setStyle("PRIMARY");

  private readonly timeActionRowBuilder = new ActionRowBuilder().addComponents(
    this.increment1Hour,
    this.decrement1Hour,
    new ButtonBuilder(this.dudButtonBuilder.setCustomId("dud2")),
    this.increment5Minutes,
    this.decrement5Minutes
  );

  private _lastInteraction: MessageComponentInteraction | null = null;

  private _disableButtonBuilders = true;

  private async generateEmbed() {
    return generateProfileEmbed(
      this.user,
      this.autoUserModel || undefined,
      this.autoDaysModel || undefined,
      this.devicesModel || undefined
    );
  }

  private async update(interaction: HSBMessageComponentInteraction) {
    this._lastInteraction = interaction;
    await interaction.update({
      embeds: [await this.generateEmbed()],
    });
  }

  private async editReply(interaction: HSBMessageComponentInteraction) {
    this._lastInteraction = interaction;
    await interaction.editReply({
      embeds: [await this.generateEmbed()],
    });
  }

  private async onDeviceSelect(interaction: HSBSelectMenuInteraction) {
    const device = interaction.values[0];
    this.devicesModel = await createOrUpdate<
      Devices,
      DevicesAttributes,
      DevicesAttributes
    >(
      Devices,
      {
        userId: this.user.id,
        device,
      },
      { userId: this.user.id }
    );
    await Promise.all([this.update(interaction), this.devicesModel!.save()]);
  }

  private async onTypeSelect(interaction: HSBSelectMenuInteraction) {
    const choice = interaction.values[0];
    this.autoUserModel!.type = choice as screeningTypeType;
    await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
  }

  private async onDaySelect(interaction: HSBSelectMenuInteraction) {
    this.autoDaysModel!.onSunday = false;
    this.autoDaysModel!.onMonday = false;
    this.autoDaysModel!.onTuesday = false;
    this.autoDaysModel!.onWednesday = false;
    this.autoDaysModel!.onThursday = false;
    this.autoDaysModel!.onFriday = false;
    this.autoDaysModel!.onSaturday = false;
    interaction.values.forEach((day) => {
      this.autoDaysModel![`on${day}`] = true;
    });
    await Promise.all([this.update(interaction), this.autoDaysModel!.save()]);
  }

  private async onEnableEmailOnly(interaction: HSBMessageComponentInteraction) {
    this.autoUserModel!.emailOnly = true;
    await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
  }

  private async onDisableEmailOnly(
    interaction: HSBMessageComponentInteraction
  ) {
    this.autoUserModel!.emailOnly = false;
    await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
    await interaction.followUp({
      content:
        "To confirm that email-only mode will work, the bot will attempt to send a test screenshot.",
      ephemeral: true,
    });
    try {
      const { user } = interaction;
      await (await user.createDM()).sendTyping();
      await interaction.client.screeningClient.queueAutoCommand(
        interaction.user.id,
        {
          itemType: ItemType.user,
          item: user,
        }
      );
    } catch (e) {
      if (
        e.name === "DiscordAPIError" &&
        e.message === "Cannot send messages to this user"
      ) {
        this.autoUserModel!.emailOnly = true;
        await Promise.all([
          this.editReply(interaction),
          this.autoUserModel!.save(),
          interaction.followUp({
            content:
              "I cannot send you a screening, possibly due to DMs being disabled from server members. Therefore, you will be set to email-only screenings. In order to disable email-only mode, please rerun `/set` after making sure your DMs are open again.",
            ephemeral: true,
          }),
        ]);
      } else {
        throw e;
      }
    }
  }

  private async onEnablePaused(interaction: HSBMessageComponentInteraction) {
    this.autoUserModel!.paused = true;
    await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
  }

  private async onDisablePaused(interaction: HSBMessageComponentInteraction) {
    this.autoUserModel!.paused = false;
    await this.autoUserModel!.save();
    await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
  }

  private async onIncrement1Hour(interaction: HSBMessageComponentInteraction) {
    this.autoUserModel!.hour += 1;
    if (this.autoUserModel!.hour > 23) {
      this.autoUserModel!.hour = 0;
    }

    await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
  }

  private async onDecrement1Hour(interaction: HSBMessageComponentInteraction) {
    this.autoUserModel!.hour -= 1;
    if (this.autoUserModel!.hour < 0) {
      this.autoUserModel!.hour = 23;
    }

    await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
  }

  private async onIncrement5Minutes(
    interaction: HSBMessageComponentInteraction
  ) {
    this.autoUserModel!.minute += 5;
    if (this.autoUserModel!.minute > 59) {
      this.autoUserModel!.minute = this.autoUserModel!.minute - 60;
      await this.onIncrement1Hour(interaction);
    } else {
      await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
    }
  }

  private async onDecrement5Minutes(
    interaction: HSBMessageComponentInteraction
  ) {
    this.autoUserModel!.minute -= 5;
    if (this.autoUserModel!.minute < 0) {
      this.autoUserModel!.minute = this.autoUserModel!.minute + 60;
      await this.onDecrement1Hour(interaction);
    } else {
      await Promise.all([this.update(interaction), this.autoUserModel!.save()]);
    }
  }

  private disableAll() {
    for (const actionRow of this.collector.rows) {
      for (const component of actionRow.components) {
        component.disabled = true;
      }
    }
  }

  public enableDeviceRowOnly() {
    this.collector.addComponent(this.deviceSelect, (interaction) =>
      this.onDeviceSelect.bind(this)(
        interaction.interaction as HSBSelectMenuInteraction
      )
    );
    this.collector.onEnd = async function (
      collected: Collection<Snowflake, ActionRowBuilderComponent>,
      reason: string,
      customCollector: CustomCollector
    ) {
      this.disableAll();
      if (this._lastInteraction !== null) {
        await this._lastInteraction.editReply({
          components: customCollector.rows,
        });
      } else if (this._disableButtonBuilders) {
        await customCollector.message.edit({
          components: customCollector.rows,
        });
      }
    }.bind(this);
  }

  public loadAll() {
    this.enableDeviceRowOnly();
    this.collector.addComponent(this.typeSelect, (interaction) =>
      this.onTypeSelect.bind(this)(
        interaction.interaction as HSBSelectMenuInteraction
      )
    );
    this.collector.addComponent(this.daySelect, (interaction) =>
      this.onDaySelect.bind(this)(
        interaction.interaction as HSBSelectMenuInteraction
      )
    );
    this.collector.addActionRowBuilder(this.booleanActionRowBuilder, [
      (interaction) =>
        this.onEnableEmailOnly.bind(this)(
          interaction.interaction as HSBMessageComponentInteraction
        ),
      (interaction) =>
        this.onDisableEmailOnly.bind(this)(
          interaction.interaction as HSBMessageComponentInteraction
        ),
      async () => undefined,
      (interaction) =>
        this.onEnablePaused.bind(this)(
          interaction.interaction as HSBMessageComponentInteraction
        ),
      (interaction) =>
        this.onDisablePaused.bind(this)(
          interaction.interaction as HSBMessageComponentInteraction
        ),
    ]);
    this.collector.addActionRowBuilder(this.timeActionRowBuilder, [
      (interaction) =>
        this.onIncrement1Hour.bind(this)(
          interaction.interaction as HSBMessageComponentInteraction
        ),
      (interaction) =>
        this.onDecrement1Hour.bind(this)(
          interaction.interaction as HSBMessageComponentInteraction
        ),
      async () => undefined,
      (interaction) =>
        this.onIncrement5Minutes.bind(this)(
          interaction.interaction as HSBMessageComponentInteraction
        ),
      (interaction) =>
        this.onDecrement5Minutes.bind(this)(
          interaction.interaction as HSBMessageComponentInteraction
        ),
    ]);
  }

  async send(options: MessageOptions) {
    if (options.ephemeral) {
      this._disableButtonBuilders = false;
    }

    return this.collector.send(
      {
        embeds: [await this.generateEmbed()],
        ...options,
      },
      60000
    );
  }
}
