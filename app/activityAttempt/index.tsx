import BreathingAttemptScreen from "@/components/breathingAttempt";
import EarthquakeAttemptScreen from "@/components/earthquakeAttempt";
import FanAttemptScreen from "@/components/fanAttempt";
import HumanPerformanceLabAttemptScreen from "@/components/humanPerformanceLabAttempt";
import ParachuteAttemptScreen from "@/components/parachuteAttempt";
import ReactionBoardAttemptScreen from "@/components/reactionBoardAttempt";
import SoundAttemptScreen from "@/components/soundAttempt";
import { ActivityContext } from "@/context/ActivityContext";
import * as Battery from "expo-battery";
import { use, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text } from "react-native";

export default function ActivityAttemptMainScreen(){
  const { t } = useTranslation();
    const activityContext = use(ActivityContext);
    if (!activityContext) return null;

    const {activity} = activityContext;

    useEffect(() => {
        async function checkPowerMode() {
            const lowPowerMode =
                await Battery.isLowPowerModeEnabledAsync();

            if (lowPowerMode) {
                Alert.alert(
                    t("errorMessages.batterySaverOn"),
                    t("errorMessages.batterySaverOnDescription")
                );
            }
        }

        checkPowerMode();
    }, []);

    const renderScreen = () => {
        switch (activity?.key){
            case "breathing-pace-trainer":
                return <BreathingAttemptScreen />;
            case "reaction-board-challenge":
                return <ReactionBoardAttemptScreen />;
            case "stretch-speed-and-gracefulness":
                return <HumanPerformanceLabAttemptScreen />;
            case "parachute-drop-challenge":
                return <ParachuteAttemptScreen />;
            case "sound-pollution-hunter":
                return <SoundAttemptScreen />;
            case "hand-fan-challenge":
                return <FanAttemptScreen />;
            case "earthquake-resistant-structure":
                return <EarthquakeAttemptScreen />;
            default:
                return <Text>{t("common.notImplemented")}</Text>;
        }
    };

    return renderScreen();
}