import BreathingAttemptScreen from "@/components/breathingAttempt";
import HumanPerformanceLabAttemptScreen from "@/components/humanPerformanceLabAttempt";
import ReactionBoardAttemptScreen from "@/components/reactionBoardAttempt";
import ParachuteAttemptScreen from "@/components/parachuteAttempt";
import SoundAttemptScreen from "@/components/soundAttempt";
import FanAttemptScreen from "@/components/fanAttempt";
import EarthquakeAttemptScreen from "@/components/earthquakeAttempt";
import { ActivityContext } from "@/context/ActivityContext";
import { useContext } from "react";
import { Text } from "react-native";

export default function ActivityAttemptMainScreen(){
    const activityContext = useContext(ActivityContext);
    if (!activityContext) return null;

    const {activity} = activityContext;

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
                return <Text>Not Implemented</Text>
    }}

    return renderScreen();
}