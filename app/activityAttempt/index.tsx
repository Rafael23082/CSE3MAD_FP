import BreathingAttemptScreen from "@/components/breathingAttempt";
import ReactionBoardAttemptScreen from "@/components/reactionBoardAttempt";
import { ActivityContext } from "@/context/ActivityContext";
import { useContext } from "react";

export default function ActivityAttemptMainScreen(){
    const activityContext = useContext(ActivityContext);
    if (!activityContext) return null;

    const {activity} = activityContext;

    switch (activity?.name){
        case "Breathing Pace Trainer":
            return <BreathingAttemptScreen />;
        case "Reaction Board Challenge":
            return <ReactionBoardAttemptScreen />;
    }
} 