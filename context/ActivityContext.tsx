import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = '@stemm_experiment_logs';

export type Activity = {
    key: string,
    name: string,
    description: string,
    image: any,
    equipments: any[],
    instructions: any[],
    phases?: string[],
    instructionImage: any
}

export type ExperimentLog = {
    timestamp: number;
    activityKey: string;
    data: any;
};

type ActivityContextProps = {
    activity: Activity | undefined;
    setActivity: Dispatch<SetStateAction<Activity | undefined>>;
    experimentLogs: ExperimentLog[];
    addExperimentLog: (log: Omit<ExperimentLog, 'timestamp'>) => void;
    clearExperimentLogs: (activityKey?: string) => void;
}

export const ActivityContext = createContext<ActivityContextProps | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
    const [activity, setActivity] = useState<Activity | undefined>(undefined);
    const [experimentLogs, setExperimentLogs] = useState<ExperimentLog[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Load persisted logs on mount
    useEffect(() => {
        const loadLogs = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed: ExperimentLog[] = JSON.parse(stored);
                    setExperimentLogs(parsed);
                }
            } catch (e) {
                console.warn('Failed to load experiment logs:', e);
            } finally {
                setLoaded(true);
            }
        };
        loadLogs();
    }, []);

    // Persist logs to AsyncStorage whenever they change (only after initial load)
    useEffect(() => {
        if (!loaded) return;
        const saveLogs = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(experimentLogs));
            } catch (e) {
                console.warn('Failed to save experiment logs:', e);
            }
        };
        saveLogs();
    }, [experimentLogs, loaded]);

    const addExperimentLog = useCallback((log: Omit<ExperimentLog, 'timestamp'>) => {
        const entry: ExperimentLog = { ...log, timestamp: Date.now() };
        setExperimentLogs(prev => [...prev, entry]);
    }, []);

    const clearExperimentLogs = useCallback((activityKey?: string) => {
        if (activityKey) {
            setExperimentLogs(prev => prev.filter(log => log.activityKey !== activityKey));
        } else {
            setExperimentLogs([]);
        }
    }, []);

    return (
        <ActivityContext.Provider value={{activity, setActivity, experimentLogs, addExperimentLog, clearExperimentLogs}}>
            {children}
        </ActivityContext.Provider>
    );
}