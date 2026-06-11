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

type ActionValues = Record<string, Record<string, string | number>>;

type ActivityContextProps = {
    activity: Activity | undefined;
    setActivity: Dispatch<SetStateAction<Activity | undefined>>;
    experimentLogs: ExperimentLog[];
    addExperimentLog: (log: Omit<ExperimentLog, 'timestamp'>) => void;
    clearExperimentLogs: (activityKey?: string) => void;
    predictions: Record<string, string>;
    setPredictions: Dispatch<SetStateAction<Record<string, string>>>;
    discussionAnswers: Record<string, string>;
    setDiscussionAnswers: Dispatch<SetStateAction<Record<string, string>>>;
    reflection: string;
    setReflection: Dispatch<SetStateAction<string>>;
    rating: number | null;
    setRating: Dispatch<SetStateAction<number | null>>;
    evidenceUri: string | null;
    setEvidenceUri: Dispatch<SetStateAction<string | null>>;
    clearActivityState: () => void;
    actionSubmissions: ActionValues;
    submitAction: (actionId: string, values: Record<string, string | number>) => void;
    completedActions: string[];
    isActionComplete: (actionId: string) => boolean;
}

export const ActivityContext = createContext<ActivityContextProps | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
    const [activity, setActivity] = useState<Activity | undefined>(undefined);
    const [experimentLogs, setExperimentLogs] = useState<ExperimentLog[]>([]);
    const [predictions, setPredictions] = useState<Record<string, string>>({});
    const [discussionAnswers, setDiscussionAnswers] = useState<Record<string, string>>({});
    const [reflection, setReflection] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [evidenceUri, setEvidenceUri] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [actionSubmissions, setActionSubmissions] = useState<ActionValues>({});

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

    const clearActivityState = useCallback(() => {
        setPredictions({});
        setDiscussionAnswers({});
        setReflection("");
        setRating(null);
        setEvidenceUri(null);
        setActionSubmissions({});
    }, []);

    const submitAction = useCallback((actionId: string, values: Record<string, string | number>) => {
        setActionSubmissions(prev => ({ ...prev, [actionId]: values }));
        setExperimentLogs(prev => [...prev, {
            activityKey: activity?.key ?? '',
            data: { actionId, ...values },
            timestamp: Date.now()
        }]);
    }, [activity?.key]);

    const completedActions = Object.keys(actionSubmissions);

    const isActionComplete = useCallback((actionId: string): boolean => {
        return actionId in actionSubmissions;
    }, [actionSubmissions]);

    return (
        <ActivityContext.Provider value={{
            activity, setActivity,
            experimentLogs, addExperimentLog, clearExperimentLogs,
            predictions, setPredictions,
            discussionAnswers, setDiscussionAnswers,
            reflection, setReflection,
            rating, setRating,
            evidenceUri, setEvidenceUri,
            clearActivityState,
            actionSubmissions, submitAction,
            completedActions, isActionComplete
        }}>
            {children}
        </ActivityContext.Provider>
    );
}