import { Activity } from "@/context/ActivityContext";

export const activities: Record<string, Activity> = {
    "parachute-drop-challenge": {
        name: "Parachute Drop Challenge",
        description: "Design, build, and test a parachute for a small toy to reduce its landing speed and impact force. Your team will iterate under time and material constraints to achieve the slowest and safest landing within the target area.",
        image: require("@/assets/images/pexels-no-one-knows-me-158523061-10758989.jpg"),
        instructions: [
            {
                instruction: "Drop the toy without a parachute and record the fall (baseline test).",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Build a parachute using provided materials.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Drop the toy from the same height and record the fall.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Review speed and landing accuracy results in the app.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Redesign and test up to three prototypes within 20 minutes.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Upload videos, results, and team reflections.",
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: "Plastic Trash Bag",
                description: "Used to create the canopy of the parachute.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "String",
                description: "Used for the shroud lines to connect the canopy to the load.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "Small toy",
                description: "Serves as the 'passenger' or cargo for the drop test.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "Table",
                description: "Provides a consistent, measured drop height to ensure fair testing.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "Scissors",
                description: "Used to cut and shape the canopy and string to specific design requirements.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "Tape",
                description: "Secures the components together and marks the drop height.",
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "sound-pollution-hunter": {
        name: "Sound Pollution Hunter",
        description: "Students act as environmental investigators to measure and compare sound levels produced by different classroom activities. The goal is to identify how energy and surfaces affect sound intensity and to understand the health risks associated with prolonged noise exposure.",
        image: require("@/assets/images/pexels-splitshire-1534.jpg"),
        instructions: [
            {
                instruction: "Measure noise from different actions (dropping objects, talking, walking, stamping your feet).",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Record sound levels and locations.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Map loud and quiet zones.",
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: "Any Object",
                description: "Object that is dropped to measure noise from.",
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "hand-fan-challenge": {
        name: "Hand Fan Challenge",
        description: "Students test how air movement applies force to flexible materials. By designing different hand fans and testing them against paper and cardboard targets, teams investigate the relationship between fan design, distance, and material stiffness.",
        image: require("@/assets/images/pexels-cottonbro-8102643.jpg"),
        instructions: [
            {
                instruction: "Stand paper upright on a table.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Fan air from 30 cm away.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Observe and record movement.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Repeat with different fan designs and fan distances (15 cm, 30 cm, 45 cm).",
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: "Paper and cardboard",
                description: "Used as raw materials to construct both the fan and the vertical target.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "Scissors",
                description: "Enables precise cutting of materials to create specific fan shapes and sizes.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "Sticky Tape",
                description: "Secures the vertical target to the table so it can bend without falling.",
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "earthquake-resistant-structure": {
        name: "Earthquake-Resistant Structure",
        description: "Students design and build structural prototypes to withstand simulated earthquake vibrations. The goal is to use iterative engineering to create a base that absorbs and distributes energy, protecting the 'building' (the mobile phone) from excessive movement.",
        image: require("@/assets/images/pexels-leon-lawrence-156921555-14491727.jpg"),
        instructions: [
            {
                instruction: "Secure the vertical target to the table so it can bend without falling.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Place a flat cardboard platform on top.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Place the phone in the center and activate vibration mode on the STEMM App.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Modify the structure to reduce movement (e.g. more pillars, more folds, etc).",
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: "Paper and cardboard",
                description: "Primary materials used to construct the structural platform and anti-vibration layers.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "Scissors",
                description: "Enables precise cutting of materials to create specific fan shapes and sizes.",
                image: require("@/assets/images/placeholder.jpg")
            },
            {
                toolName: "Sticky Tape",
                description: "Secures the vertical target to the table so it can bend without falling.",
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "stretch-speed-and-gracefulness": {
        name: "Stretch Speed & Gracefulness",
        description: "Students investigate human biomechanics by measuring the speed and smoothness of their movements during controlled stretching. Using the phone's vibration sensors, teams analyze how 'gracefully' they can move and how fatigue or speed impacts physical coordination.",
        image: require("@/assets/images/pexels-barbara-olsen-7869576.jpg"),
        instructions: [
            {
                instruction: "Hold the phone firmly in one hand. Activate the app vibration sensor.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Perform guided movement slowly as shown in the app. Record the vibration.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Repeat the activity with vibration feedback enabled.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Review speed, smoothness, and range-of-motion data.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Upload results and reflect as a group.",
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: "Open space",
                description: "Provides a safe environment for students to perform full-range-of-motion exercises.",
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "reaction-board-challenge": {
        name: "Reaction Board Challenge",
        description: "Students test their neuromuscular coordination by measuring reaction times under different conditions. The activity uses the phone as a digital 'stimulus and response' board to capture the speed of the brain-to-body signaling pathway.",
        image: require("@/assets/images/speed_8252022_layout_07.jpg"),
        instructions: [
            {
                instruction: "Tap the screen as soon as the hidden button appears. Record reaction time.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Repeat using the non-dominant hand. Compare results.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Trace a moving shape on the screen. Review accuracy and delay.",
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: "Variable Distractions",
                description: "Music, conversation, or physical tasks used to test how cognitive load affects response time.",
                image: require("@/assets/images/placeholder.jpg")
            }
        ]
    },

    "breathing-pace-trainer": {
        name: "Breathing Pace Trainer",
        description: "Students explore the relationship between respiration and physical relaxation. By following a digital pacer, they learn to control their breathing rate to observe how conscious regulation affects heart rate or perceived stress levels.",
        image: require("@/assets/images/rm373batch7-18a.jpg"),
        instructions: [
            {
                instruction: "Place the phone gently on the chest.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Record breathing at rest.",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Perform light exercise (jog one minute on the spot and do 100 star jumps).",
                video: require("@/assets/images/placeholder.jpg")
            },
            {
                instruction: "Record breathing again and compare results.",
                video: require("@/assets/images/placeholder.jpg")
            }
        ],
        equipments: [
            {
                toolName: "Flat surface",
                description: "Music, conversation, or physical tasks used to test how cognitive load affects response time.",
                image: require("@/assets/images/placeholder.jpg")
            }
        ],
        phases: [
            "Rest",
            "Jogging One Minute",
            "100 Star Jumps"
        ]
    },
};