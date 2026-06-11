import { Activity } from "@/context/ActivityContext";
import i18n from "@/i18n";

const placeholderVideo = require("@/assets/images/placeholder.jpg");

const activityMedia = {
  parachuteDropChallenge: {
    equipments: [
      require("@/assets/images/plastic-bag.png"),
      require("@/assets/images/string.png"),
      require("@/assets/images/small-toy.png"),
      require("@/assets/images/table.png"),
      require("@/assets/images/scissors.png"),
      require("@/assets/images/tape.png"),
    ],
  },

  soundPollutionHunter: {
    equipments: [
      require("@/assets/images/any-object.png"),
    ],
  },

  handFanChallenge: {
    equipments: [
      require("@/assets/images/paper.png"),
      require("@/assets/images/scissors.png"),
      require("@/assets/images/sticky-tape.png"),
    ],
  },

  earthquakeResistantStructure: {
    equipments: [
      require("@/assets/images/paper.png"),
      require("@/assets/images/scissors.png"),
      require("@/assets/images/sticky-tape.png"),
    ],
  },

  stretchSpeedAndGracefulness: {
    equipments: [
      require("@/assets/images/open-space.png"),
    ],
  },

  reactionBoardChallenge: {
    equipments: [
      require("@/assets/images/placeholder.jpg"),
    ],
  },

  breathingPaceTrainer: {
    equipments: [
      require("@/assets/images/open-space.png"),
    ],
  },
};

const mapInstructions = (path: string, t: any) => {
  const instructions = t(path, {
    returnObjects: true,
  });

  if (!Array.isArray(instructions)) {
    return [];
  }

  return instructions;
};

const mapEquipments = (activityKey: keyof typeof activityMedia, path: string, t: any) => {
  const equipments = t(path, {
    returnObjects: true,
  }) as Array<{ name: string; description: string }>;

  const media = activityMedia[activityKey]?.equipments ?? [];

  return equipments.map((equipment, index) => ({
    toolName: equipment.name,
    description: equipment.description,
    image: media[index] ?? placeholderVideo,
  }));
};

const mapPhases = (path: string, t: any) => {
  return t(path, {
    returnObjects: true,
  }) as string[];
};

export const getActivities = (t: any): Record<string, Activity> => ({
  "parachute-drop-challenge": {
      key: "parachute-drop-challenge",
      name: t("activities.parachuteDropChallenge.name"),
      description: i18n.t("activities.parachuteDropChallenge.description"),
      image: require("@/assets/images/pexels-no-one-knows-me-158523061-10758989.jpg"),
      instructions: mapInstructions("activities.parachuteDropChallenge.instructions", t),
      equipments: mapEquipments(
          "parachuteDropChallenge",
          "activities.parachuteDropChallenge.equipments",
          t
      ),
      instructionImage: require("@/assets/images/parachute-instruction.jpg"),
  },

  "sound-pollution-hunter": {
      key: "sound-pollution-hunter",
      name: t("activities.soundPollutionHunter.name"),
      description: t("activities.soundPollutionHunter.description"),
      image: require("@/assets/images/pexels-splitshire-1534.jpg"),
      instructions: mapInstructions("activities.soundPollutionHunter.instructions", t),
      equipments: mapEquipments(
          "soundPollutionHunter",
          "activities.soundPollutionHunter.equipments",
          t
      ),
      instructionImage: require("@/assets/images/sound-instruction.jpg"),
  },

  "hand-fan-challenge": {
      key: "hand-fan-challenge",
      name: t("activities.handFanChallenge.name"),
      description: t("activities.handFanChallenge.description"),
      image: require("@/assets/images/pexels-cottonbro-8102643.jpg"),
      instructions: mapInstructions("activities.handFanChallenge.instructions", t),
      equipments: mapEquipments(
          "handFanChallenge",
          "activities.handFanChallenge.equipments",
          t
      ),
      instructionImage: require("@/assets/images/fan-instruction.jpeg"),
  },

  "earthquake-resistant-structure": {
      key: "earthquake-resistant-structure",
      name: t("activities.earthquakeResistantStructure.name"),
      description: t("activities.earthquakeResistantStructure.description"),
      image: require("@/assets/images/pexels-leon-lawrence-156921555-14491727.jpg"),
      instructions: mapInstructions("activities.earthquakeResistantStructure.instructions", t),
      equipments: mapEquipments(
          "earthquakeResistantStructure",
          "activities.earthquakeResistantStructure.equipments",
          t
      ),
      instructionImage: require("@/assets/images/earthquake-instruction.jpg"),
  },

  "stretch-speed-and-gracefulness": {
      key: "stretch-speed-and-gracefulness",
      name: t("activities.stretchSpeedAndGracefulness.name"),
      description: t("activities.stretchSpeedAndGracefulness.description"),
      image: require("@/assets/images/pexels-barbara-olsen-7869576.jpg"),
      instructions: mapInstructions("activities.stretchSpeedAndGracefulness.instructions", t),
      equipments: mapEquipments(
          "stretchSpeedAndGracefulness",
          "activities.stretchSpeedAndGracefulness.equipments",
          t
      ),
      phases: mapPhases("activities.stretchSpeedAndGracefulness.phases", t),
      instructionImage: require("@/assets/images/stretch-instruction.jpg"),
  },

  "reaction-board-challenge": {
      key: "reaction-board-challenge",
      name: t("activities.reactionBoardChallenge.name"),
      description: t("activities.reactionBoardChallenge.description"),
      image: require("@/assets/images/speed_8252022_layout_07.jpg"),
      instructions: mapInstructions("activities.reactionBoardChallenge.instructions", t),
      equipments: mapEquipments(
          "reactionBoardChallenge",
          "activities.reactionBoardChallenge.equipments",
          t
      ),
      phases: mapPhases("activities.reactionBoardChallenge.phases", t),
      instructionImage: require("@/assets/images/reaction-instruction.jpg"),
  },

  "breathing-pace-trainer": {
      key: "breathing-pace-trainer",
      name: t("activities.breathingPaceTrainer.name"),
      description: t("activities.breathingPaceTrainer.description"),
      image: require("@/assets/images/rm373batch7-18a.jpg"),
      instructions: mapInstructions("activities.breathingPaceTrainer.instructions", t),
      equipments: mapEquipments(
          "breathingPaceTrainer",
          "activities.breathingPaceTrainer.equipments",
          t
      ),
      phases: mapPhases("activities.breathingPaceTrainer.phases", t),
      instructionImage: require("@/assets/images/breathing-instruction.jpg"),
  },
});