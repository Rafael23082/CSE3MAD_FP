import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export type Activity = {
    key: string,
    name: string,
    description: string,
    image: any,
    equipments: any[],
    instructions: any[],
    phases?: string[]
}

type ActivityContextProps = {
    activity: Activity | undefined,
    setActivity: Dispatch<SetStateAction<Activity | undefined>>
}

export const ActivityContext = createContext<ActivityContextProps | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
    const [activity, setActivity] = useState<Activity | undefined>(undefined);

    return (
        <ActivityContext.Provider value={{activity, setActivity}}>
            {children}
        </ActivityContext.Provider>
    );
}