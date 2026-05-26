import BreathingAttemptScreen from "@/components/breathingAttempt";
import HumanPerformanceLabAttemptScreen from "@/components/humanPerformanceLabAttempt";
import ReactionBoardAttemptScreen from "@/components/reactionBoardAttempt";
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
            default: 
                return <Text>Bruv</Text>
    }}

    return renderScreen();
}