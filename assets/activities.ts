import { Activity } from "@/context/ActivityContext";
import i18n from "@/i18n";

const placeholderVideo = require("@/assets/images/placeholder.jpg");

const mapInstructions = (path: string) => {
  const instructions = i18n.t(path, {
    returnObjects: true,
  }) as string[];

  return instructions.map((instruction) => ({
    instruction,
    video: placeholderVideo,
  }));
};

const mapEquipments = (path: string) => {
  const equipments = i18n.t(path, {
    returnObjects: true,
  }) as Array<{ name: string; description: string }>;

  return equipments.map((equipment) => ({
    toolName: equipment.name,
    description: equipment.description,
    image: placeholderVideo,
  }));
};

const mapPhases = (path: string) => {
  return i18n.t(path, {
    returnObjects: true,
  }) as string[];
};

export const getActivities = (t: any): Record<string, Activity> => ({
    "parachute-drop-challenge": {
        key: "parachute-drop-challenge",
        name: i18n.t("activities.parachuteDropChallenge.name"),
        description: i18n.t("activities.parachuteDropChallenge.description"),
        image: require("@/assets/images/pexels-no-one-knows-me-158523061-10758989.jpg"),
        instructions: mapInstructions("activities.parachuteDropChallenge.instructions"),
        equipments: mapEquipments("activities.parachuteDropChallenge.equipments"),
    },

    "sound-pollution-hunter": {
        key: "sound-pollution-hunter",
        name: i18n.t("activities.soundPollutionHunter.name"),
        description: i18n.t("activities.soundPollutionHunter.description"),
        image: require("@/assets/images/pexels-splitshire-1534.jpg"),
        instructions: mapInstructions("activities.soundPollutionHunter.instructions"),
        equipments: mapEquipments("activities.soundPollutionHunter.equipments"),
    },

    "hand-fan-challenge": {
        key: "hand-fan-challenge",
        name: i18n.t("activities.handFanChallenge.name"),
        description: i18n.t("activities.handFanChallenge.description"),
        image: require("@/assets/images/pexels-cottonbro-8102643.jpg"),
        instructions: mapInstructions("activities.handFanChallenge.instructions"),
        equipments: mapEquipments("activities.handFanChallenge.equipments"),
    },

    "earthquake-resistant-structure": {
        key: "earthquake-resistant-structure",
        name: i18n.t("activities.earthquakeResistantStructure.name"),
        description: i18n.t("activities.earthquakeResistantStructure.description"),
        image: require("@/assets/images/pexels-leon-lawrence-156921555-14491727.jpg"),
        instructions: mapInstructions("activities.earthquakeResistantStructure.instructions"),
        equipments: mapEquipments("activities.earthquakeResistantStructure.equipments"),
    },

    "stretch-speed-and-gracefulness": {
        key: "stretch-speed-and-gracefulness",
        name: i18n.t("activities.stretchSpeedAndGracefulness.name"),
        description: i18n.t("activities.stretchSpeedAndGracefulness.description"),
        image: require("@/assets/images/pexels-barbara-olsen-7869576.jpg"),
        instructions: mapInstructions("activities.stretchSpeedAndGracefulness.instructions"),
        equipments: mapEquipments("activities.stretchSpeedAndGracefulness.equipments"),
        phases: mapPhases("activities.stretchSpeedAndGracefulness.phases"),
    },

    "reaction-board-challenge": {
        key: "reaction-board-challenge",
        name: i18n.t("activities.reactionBoardChallenge.name"),
        description: i18n.t("activities.reactionBoardChallenge.description"),
        image: require("@/assets/images/speed_8252022_layout_07.jpg"),
        instructions: mapInstructions("activities.reactionBoardChallenge.instructions"),
        equipments: mapEquipments("activities.reactionBoardChallenge.equipments"),
        phases: mapPhases("activities.reactionBoardChallenge.phases"),
    },

    "breathing-pace-trainer": {
        key: "breathing-pace-trainer",
        name: i18n.t("activities.breathingPaceTrainer.name"),
        description: i18n.t("activities.breathingPaceTrainer.description"),
        image: require("@/assets/images/rm373batch7-18a.jpg"),
        instructions: mapInstructions("activities.breathingPaceTrainer.instructions"),
        equipments: mapEquipments("activities.breathingPaceTrainer.equipments"),
        phases: mapPhases("activities.breathingPaceTrainer.phases"),
    },
});