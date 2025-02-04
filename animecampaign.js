import { animecampaign } from "./module/config.js";
import AC from "./module/AC.js";

import ACActor from "./module/documents/ACActor.js";
import CharacterSheet from "./module/sheets/CharacterSheet.js";
import { CharacterData } from "./module/data-models/CharacterData.js";

import ACItem from "./module/documents/ACItem.js";
import KitPieceSheet from "./module/sheets/KitPieceSheet.js";
import { KitPieceData } from "./module/data-models/KitPieceData.js";

import { RolledItem } from "./module/RolledItem.js";

//  Preloads the filepaths for the Handlebars partials.
//*     () : Promise<Function[]>
async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/animecampaign/templates/sheets/partials/character-summary.hbs",
        "systems/animecampaign/templates/sheets/partials/stats.hbs",
        "systems/animecampaign/templates/sheets/partials/sections.hbs",
        "systems/animecampaign/templates/sheets/partials/kit.hbs",
        "systems/animecampaign/templates/sheets/partials/upgrades.hbs",
        "systems/animecampaign/templates/sheets/partials/biography.hbs",
    ];

    return loadTemplates(templatePaths);
}

//  All of our code that runs on initialization.
Hooks.once("init", () => {
    AC.log("Initializing Anime Campaign System");
    
    //  Adding our localization object to Foundry's CONFIG object.
    CONFIG.animecampaign = animecampaign;

    //  Assigning Fonts
    CONFIG.fontDefinitions = { ...CONFIG.fontDefinitions, ...AC.fonts };
    CONFIG.defaultFontFamily = 'Arial';

    //  Redefining the default document classes.
    CONFIG.Actor.documentClass = ACActor;
    CONFIG.Item.documentClass = ACItem;

    //  Assigning Character and Kit Piece schema.
    CONFIG.Actor.dataModels["Character"] = CharacterData;
    CONFIG.Item.dataModels["Kit Piece"] = KitPieceData;

    //  Unregistering the default document sheets & registering our own.
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("animecampaign", CharacterSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("animecampaign", KitPieceSheet, { makeDefault: true });

    preloadHandlebarsTemplates();

    //  Adding our custom Handlebars helpers.
    Handlebars.registerHelper(AC.hbsHelpers);
})

//  All of the code that runs for chat messages.
Hooks.on('renderChatMessage', (_app, _html, _data) => {
    RolledItem.addChatListeners(_html);
})