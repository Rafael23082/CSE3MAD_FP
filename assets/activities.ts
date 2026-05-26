import { Activity } from "@/context/ActivityContext";
import i18n from "@/i18n";

export const activities: Record<string, Activity> = {
    "parachute-drop-challenge": {
        key: "parachute-drop-challenge",
        name: i18n.t("activities.parachuteDropChallenge.name"),
        description: i18n.t("activities.parachuteDropChallenge.description"),
        image: require("@/assets/images/pexels-no-one-knows-me-158523061-10758989.jpg"),
        instructions: [
            {
                instruction: (i18n.t("activities.parachuteDropChallenge.instructions", {returnObjects: true}) as string[])[0],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.parachuteDropChallenge.instructions", {returnObjects: true}) as string[])[1],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.parachuteDropChallenge.instructions", {returnObjects: true}) as string[])[2],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.parachuteDropChallenge.instructions", {returnObjects: true}) as string[])[3],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.parachuteDropChallenge.instructions", {returnObjects: true}) as string[])[4],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.parachuteDropChallenge.instructions", {returnObjects: true}) as string[])[5],
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].name,
                description: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[1].name,
                description: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[1].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[2].name,
                description: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[2].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[3].name,
                description: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[3].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[4].name,
                description: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[4].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[5].name,
                description: (i18n.t("activities.parachuteDropChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[5].description,
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "sound-pollution-hunter": {
        key: "sound-pollution-hunter",
        name: i18n.t("activities.soundPollutionHunter.name"),
        description: i18n.t("activities.soundPollutionHunter.description"),
        image: require("@/assets/images/pexels-splitshire-1534.jpg"),
        instructions: [
            {
                instruction: (i18n.t("activities.soundPollutionHunter.instructions", {returnObjects: true}) as string[])[0],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.soundPollutionHunter.instructions", {returnObjects: true}) as string[])[1],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.soundPollutionHunter.instructions", {returnObjects: true}) as string[])[2],
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: (i18n.t("activities.soundPollutionHunter.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].name,
                description: (i18n.t("activities.soundPollutionHunter.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].description,
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "hand-fan-challenge": {
        key: "hand-fan-challenge",
        name: i18n.t("activities.handFanChallenge.name"),
        description: i18n.t("activities.handFanChallenge.description"),
        image: require("@/assets/images/pexels-cottonbro-8102643.jpg"),
        instructions: [
            {
                instruction: (i18n.t("activities.handFanChallenge.instructions", {returnObjects: true}) as string[])[0],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.handFanChallenge.instructions", {returnObjects: true}) as string[])[1],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.handFanChallenge.instructions", {returnObjects: true}) as string[])[2],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.handFanChallenge.instructions", {returnObjects: true}) as string[])[3],
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: (i18n.t("activities.handFanChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].name,
                description: (i18n.t("activities.handFanChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.handFanChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[1].name,
                description: (i18n.t("activities.handFanChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[1].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.handFanChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[2].name,
                description: (i18n.t("activities.handFanChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[2].description,
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "earthquake-resistant-structure": {
        key: "earthquake-resistant-structure",
        name: i18n.t("activities.earthquakeResistantStructure.name"),
        description: i18n.t("activities.earthquakeResistantStructure.description"),
        image: require("@/assets/images/pexels-leon-lawrence-156921555-14491727.jpg"),
        instructions: [
            {
                instruction: (i18n.t("activities.earthquakeResistantStructure.instructions", {returnObjects: true}) as string[])[0],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.earthquakeResistantStructure.instructions", {returnObjects: true}) as string[])[1],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.earthquakeResistantStructure.instructions", {returnObjects: true}) as string[])[2],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.earthquakeResistantStructure.instructions", {returnObjects: true}) as string[])[3],
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: (i18n.t("activities.earthquakeResistantStructure.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].name,
                description: (i18n.t("activities.earthquakeResistantStructure.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.earthquakeResistantStructure.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[1].name,
                description: (i18n.t("activities.earthquakeResistantStructure.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[1].description,
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: (i18n.t("activities.earthquakeResistantStructure.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[2].name,
                description: (i18n.t("activities.earthquakeResistantStructure.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[2].description,
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "stretch-speed-and-gracefulness": {
        key: "stretch-speed-and-gracefulness",
        name: i18n.t("activities.stretchSpeedAndGracefulness.name"),
        description: i18n.t("activities.stretchSpeedAndGracefulness.description"),
        image: require("@/assets/images/pexels-barbara-olsen-7869576.jpg"),
        instructions: [
            {
                instruction: (i18n.t("activities.stretchSpeedAndGracefulness.instructions", {returnObjects: true}) as string[])[0],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.stretchSpeedAndGracefulness.instructions", {returnObjects: true}) as string[])[1],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.stretchSpeedAndGracefulness.instructions", {returnObjects: true}) as string[])[2],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.stretchSpeedAndGracefulness.instructions", {returnObjects: true}) as string[])[3],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.stretchSpeedAndGracefulness.instructions", {returnObjects: true}) as string[])[4],
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: (i18n.t("activities.stretchSpeedAndGracefulness.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].name,
                description: (i18n.t("activities.stretchSpeedAndGracefulness.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].description,
                image: require("@/assets/images/placeholder.jpg")
            }
        ],
        phases: [
            (i18n.t("activities.stretchSpeedAndGracefulness.phases", {returnObjects: true}) as string[])[0],
            (i18n.t("activities.stretchSpeedAndGracefulness.phases", {returnObjects: true}) as string[])[1],
            (i18n.t("activities.stretchSpeedAndGracefulness.phases", {returnObjects: true}) as string[])[2],
        ]
    },

    "reaction-board-challenge": {
        key: "reaction-board-challenge",
        name: i18n.t("activities.reactionBoardChallenge.name"),
        description: i18n.t("activities.reactionBoardChallenge.description"),
        image: require("@/assets/images/speed_8252022_layout_07.jpg"),
        instructions: [
            {
                instruction: (i18n.t("activities.reactionBoardChallenge.instructions", {returnObjects: true}) as string[])[0],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.reactionBoardChallenge.instructions", {returnObjects: true}) as string[])[1],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.reactionBoardChallenge.instructions", {returnObjects: true}) as string[])[2],
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: (i18n.t("activities.reactionBoardChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].name,
                description: (i18n.t("activities.reactionBoardChallenge.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].description,
                image: require("@/assets/images/placeholder.jpg")
            }
        ],
        phases: [
            (i18n.t("activities.reactionBoardChallenge.phases", {returnObjects: true}) as string[])[0],
            (i18n.t("activities.reactionBoardChallenge.phases", {returnObjects: true}) as string[])[1],
            (i18n.t("activities.reactionBoardChallenge.phases", {returnObjects: true}) as string[])[2],
        ]
    },

    "breathing-pace-trainer": {
        key: "breathing-pace-trainer",
        name: i18n.t("activities.breathingPaceTrainer.name"),
        description: i18n.t("activities.breathingPaceTrainer.description"),
        image: require("@/assets/images/rm373batch7-18a.jpg"),
        instructions: [
            {
                instruction: (i18n.t("activities.breathingPaceTrainer.instructions", {returnObjects: true}) as string[])[0],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.breathingPaceTrainer.instructions", {returnObjects: true}) as string[])[1],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.breathingPaceTrainer.instructions", {returnObjects: true}) as string[])[2],
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: (i18n.t("activities.breathingPaceTrainer.instructions", {returnObjects: true}) as string[])[3],
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: (i18n.t("activities.breathingPaceTrainer.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].name,
                description: (i18n.t("activities.breathingPaceTrainer.equipments", {returnObjects: true}) as Array<{name: string; description: string}>)[0].description,
                image: require("@/assets/images/placeholder.jpg")
            }
        ],
        phases: [
            (i18n.t("activities.breathingPaceTrainer.phases", {returnObjects: true}) as string[])[0],
            (i18n.t("activities.breathingPaceTrainer.phases", {returnObjects: true}) as string[])[1],
            (i18n.t("activities.breathingPaceTrainer.phases", {returnObjects: true}) as string[])[2],
        ]
    },
};