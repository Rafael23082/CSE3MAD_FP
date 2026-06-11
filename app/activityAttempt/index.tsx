import StructuredActivity from "@/components/StructuredActivity";
import { ActivityContext } from "@/context/ActivityContext";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { createAttempt } from "@/utils/activityAttempts";
import { captureLocation } from "@/utils/location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { use, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DISCUSSION_QUESTIONS: Record<string, { id: string; question: string }[]> = {
    "parachute-drop-challenge": [
        { id: "predictionsCorrect", question: "Were your predictions correct?" },
        { id: "bestDesign", question: "Which parachute design worked best?" },
        { id: "effectiveDesign", question: "What made that design effective?" },
        { id: "improvements", question: "What would you improve next time?" },
    ],
    "sound-pollution-hunter": [
        { id: "loudestAction", question: "Which action was loudest?" },
        { id: "quietestAction", question: "Which action was quietest?" },
        { id: "surprise", question: "What surprised you?" },
        { id: "noiseReduction", question: "How can noise pollution be reduced?" },
    ],
    "hand-fan-challenge": [
        { id: "largestMovement", question: "Which distance produced the largest movement?" },
        { id: "distanceEffect", question: "How did distance affect airflow?" },
        { id: "improvements", question: "What would you improve?" },
    ],
    "earthquake-resistant-structure": [
        { id: "mostStable", question: "Which structure was most stable?" },
        { id: "mostMovement", question: "Which moved the most?" },
        { id: "designFeature", question: "What design feature improved stability?" },
        { id: "changes", question: "What would you change next time?" },
    ],
    "stretch-speed-and-gracefulness": [
        { id: "predictionsCorrect", question: "Were your predictions correct?" },
        { id: "results", question: "Which movement was the easiest to keep stable?" },
        { id: "hardestMovement", question: "Which movement was the hardest to keep the vibration low?" },
        { id: "surprises", question: "Any surprises?" },
    ],
    "reaction-board-challenge": [
        { id: "predictionsCorrect", question: "Were your predictions correct?" },
        { id: "harderChallenge", question: "Which of the two category challenges were more challenging?" },
        { id: "surprises", question: "Any surprises?" },
    ],
    "breathing-pace-trainer": [
        { id: "predictionsCorrect", question: "Were your predictions correct?" },
        { id: "surprises", question: "Any surprises?" },
        { id: "activityImpact", question: "How did different levels of physical activity change your breathing rate?" },
    ],
    };

const PREDICTION_FIELDS: Record<string, { id: string; label: string; type: "radio" | "text" | "dropdown"; options?: string[] }[]> = {
  "parachute-drop-challenge": [
    { id: "bestDesign", label: "Which parachute design do you think will stay in the air the longest?", type: "radio", options: ["Design 1", "Design 2", "Design 3"] },
    { id: "bestDesignReason", label: "Why do you think this design will perform best?", type: "text" },
  ],
  "sound-pollution-hunter": [
    { id: "loudestAction", label: "Which action do you think will produce the loudest sound?", type: "dropdown", options: ["Dropping Books", "Stomping Feet", "Clapping Hands"] },
    { id: "loudestReason", label: "Explain Why", type: "text" },
  ],
  "hand-fan-challenge": [
    { id: "bestDistance", label: "Which fan distance will create the largest movement?", type: "radio", options: ["15 cm", "30 cm", "45 cm"] },
    { id: "bestDistanceReason", label: "Why?", type: "text" },
  ],
  "earthquake-resistant-structure": [
    { id: "mostStable", label: "Which structure do you think will be most stable?", type: "text" },
    { id: "mostStableReason", label: "Why?", type: "text" },
  ],
  "stretch-speed-and-gracefulness": [
    { id: "mostStable", label: "Which movement do you think will be most stable?", type: "text" },
    { id: "mostStableReason", label: "Why?", type: "text" },
  ],
  "reaction-board-challenge": [
    { id: "reactionTimeDifferencePrediction", label: "How much do you think will be the difference between your dominant and non-dominant hand reaction time (ms)?", type: "text" },
    { id: "reactionTimeDifferenceReason", label: "Why?", type: "text" },
  ],
  "breathing-pace-trainer": [
    { id: "mostBpm", label: "Which activitiy do you think will result in the hights BPM?", type: "text" },
    { id: "mostBpmReason", label: "Why?", type: "text" },
  ],
};

export default function ActivityAttemptMainScreen(){
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const activityContext = use(ActivityContext);
  const authContext = use(AuthContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    activity,
    predictions, setPredictions,
    discussionAnswers, setDiscussionAnswers,
    reflection, setReflection,
    rating, setRating,
    completedActions,
    clearActivityState
  } = activityContext || {};

  const [isSaving, setIsSaving] = useState(false);

  if (!activityContext || !activity) return null;

  const predictionFields = PREDICTION_FIELDS[activity.key] || [];
  const discussionQuestions = DISCUSSION_QUESTIONS[activity.key] || [];
  const currentPredictions = predictions || {};
  const currentDiscussionAnswers = discussionAnswers || {};
  const currentReflection = reflection || "";
  const currentRating = rating;
  const currentCompletedActions = completedActions || [];

  const handlePredictionChange = (id: string, value: string) => {
    setPredictions?.((prev: Record<string, string>) => ({ ...prev, [id]: value }));
  };

  const handleDiscussionChange = (id: string, value: string) => {
    setDiscussionAnswers?.((prev: Record<string, string>) => ({ ...prev, [id]: value }));
  };

  const isComplete = (): boolean => {
    if (currentCompletedActions.length < 3) return false;

    const hasPredictions = predictionFields.every(field => {
      const value = currentPredictions[field.id];
      return value && value.trim() !== "";
    });
    if (!hasPredictions) return false;

    const hasDiscussion = discussionQuestions.every(q => {
      const value = currentDiscussionAnswers[q.id];
      return value && value.trim() !== "";
    });
    if (!hasDiscussion) return false;

    if (!currentReflection.trim()) return false;

    return true;
  };

  const handleSave = async () => {
    if (!isComplete()) {
      Alert.alert("Incomplete", "Please complete all sections before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const user = authContext?.user;
      if (!user) {
        Alert.alert("Error", "You must be logged in to save.");
        return;
      }

      // Read 20-min challenge timer duration (parachute only)
      let timerDurationMs: number | undefined;
      const storedStart = await AsyncStorage.getItem('parachute_timer_start');
      if (storedStart) {
        timerDurationMs = Date.now() - parseInt(storedStart, 10);
      }

      // Capture GPS location at submission time
      const submissionLocation = (await captureLocation()) ?? undefined;

      const allLogs = Object.entries(activityContext.actionSubmissions).map(([actionId, values]) => ({
        activityKey: activity.key,
        data: { actionId, ...values },
        timestamp: Date.now(),
      }));

      await createAttempt(
        user.uid,
        activity.key,
        allLogs,
        currentReflection,
        currentRating,
        submissionLocation,
        undefined,
        undefined,
        currentPredictions,
        currentDiscussionAnswers,
        timerDurationMs
      );

      // Clear timer for next attempt
      await AsyncStorage.removeItem('parachute_timer_start');

      Alert.alert("Saved", "Your attempt has been saved successfully.", [
        { text: "OK", onPress: () => {
          clearActivityState?.();
          router.push({ pathname: "/activityAttempt/journal", params: { refresh: Date.now().toString() } });
        }}
      ]);
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Error", "Failed to save attempt. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <View style={styles.container}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
            showsVerticalScrollIndicator={false}
          >
              {/* 1. Predictions Section */}
              <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Predictions</Text>
                  {predictionFields.map((field) => (
                      <View key={field.id} style={styles.fieldContainer}>
                          <Text style={styles.fieldLabel}>{field.label}</Text>
                          {field.type === "radio" && field.options && (
                              <View style={styles.radioGroup}>
                                  {field.options.map((option) => (
                                      <Pressable
                                          key={option}
                                          style={[
                                              styles.radioOption,
                                              currentPredictions[field.id] === option && styles.radioOptionSelected
                                          ]}
                                          onPress={() => handlePredictionChange(field.id, option)}
                                      >
                                          <View style={[
                                              styles.radioCircle,
                                              currentPredictions[field.id] === option && styles.radioCircleSelected
                                          ]} />
                                          <Text style={styles.radioText}>{option}</Text>
                                      </Pressable>
                                  ))}
                              </View>
                          )}
                          {field.type === "text" && (
                              <TextInput
                                  style={styles.textInput}
                                  value={currentPredictions[field.id] || ""}
                                  onChangeText={(value) => handlePredictionChange(field.id, value)}
                                  placeholder="Enter your answer"
                                  placeholderTextColor={theme.textMuted}
                                  multiline
                              />
                          )}
                          {field.type === "dropdown" && field.options && (
                              <View style={styles.dropdownContainer}>
                                  {field.options.map((option) => (
                                      <Pressable
                                          key={option}
                                          style={[
                                              styles.dropdownOption,
                                              currentPredictions[field.id] === option && styles.dropdownOptionSelected
                                          ]}
                                          onPress={() => handlePredictionChange(field.id, option)}
                                      >
                                          <Text style={[
                                              styles.dropdownText,
                                              currentPredictions[field.id] === option && styles.dropdownTextSelected
                                          ]}>{option}</Text>
                                      </Pressable>
                                  ))}
                              </View>
                          )}
                      </View>
                  ))}
              </View>

              {/* 2. Structured Actions */}
              <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Experiment Records</Text>
                  <StructuredActivity activityKey={activity.key} />
              </View>

              {/* 3. Discussion Questions Section */}
              <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Discussion Questions</Text>
                  {discussionQuestions.map((q) => (
                      <View key={q.id} style={styles.fieldContainer}>
                          <Text style={styles.fieldLabel}>{q.question}</Text>
                          <TextInput
                              style={styles.textInput}
                              value={currentDiscussionAnswers[q.id] || ""}
                              onChangeText={(value) => handleDiscussionChange(q.id, value)}
                              placeholder="Enter your answer"
                              placeholderTextColor={theme.textMuted}
                              multiline
                          />
                      </View>
                  ))}
              </View>

              {/* 4. Reflection Section */}
              <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Reflection</Text>
                  <TextInput
                      style={[styles.textInput, styles.reflectionInput]}
                      value={currentReflection}
                      onChangeText={setReflection}
                      placeholder="What did you learn from this experiment?"
                      placeholderTextColor={theme.textMuted}
                      multiline
                  />
                  <View style={styles.ratingContainer}>
                      <Text style={styles.ratingLabel}>Rate your experience:</Text>
                      <View style={styles.ratingStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                              <Pressable
                                  key={star}
                                  onPress={() => setRating?.(star)}
                              >
                                  <MaterialCommunityIcons
                                      name={currentRating && star <= currentRating ? "star" : "star-outline"}
                                      size={32}
                                      color={currentRating && star <= currentRating ? "#FFD700" : theme.textMuted}
                                  />
                              </Pressable>
                          ))}
                      </View>
                  </View>
              </View>

              {/* Progress Indicators */}
              <View style={styles.progressSection}>
                  <View style={styles.progressRow}>
                      <MaterialCommunityIcons
                          name={currentCompletedActions.length >= 3 ? "check-circle" : "circle-outline"}
                          size={20}
                          color={currentCompletedActions.length >= 3 ? theme.tertiary : theme.textMuted}
                      />
                      <Text style={styles.progressText}>
                          Actions: {currentCompletedActions.length}/3
                      </Text>
                  </View>
                  <View style={styles.progressRow}>
                      <MaterialCommunityIcons
                          name={predictionFields.every(f => currentPredictions[f.id]?.trim()) ? "check-circle" : "circle-outline"}
                          size={20}
                          color={predictionFields.every(f => currentPredictions[f.id]?.trim()) ? theme.tertiary : theme.textMuted}
                      />
                      <Text style={styles.progressText}>Predictions</Text>
                  </View>
                  <View style={styles.progressRow}>
                      <MaterialCommunityIcons
                          name={discussionQuestions.every(q => currentDiscussionAnswers[q.id]?.trim()) ? "check-circle" : "circle-outline"}
                          size={20}
                          color={discussionQuestions.every(q => currentDiscussionAnswers[q.id]?.trim()) ? theme.tertiary : theme.textMuted}
                      />
                      <Text style={styles.progressText}>Discussion</Text>
                  </View>
                  <View style={styles.progressRow}>
                      <MaterialCommunityIcons
                          name={currentReflection.trim() ? "check-circle" : "circle-outline"}
                          size={20}
                          color={currentReflection.trim() ? theme.tertiary : theme.textMuted}
                      />
                      <Text style={styles.progressText}>Reflection</Text>
                  </View>
              </View>
          </ScrollView>

          {/* Save Button */}
          <View style={[styles.saveContainer]}>
              <Pressable
                  style={({ pressed }) => [
                      styles.saveBtn,
                      { backgroundColor: isComplete() ? theme.secondary : theme.textMuted },
                      pressed && { opacity: 0.85 },
                  ]}
                  onPress={handleSave}
                  disabled={!isComplete() || isSaving}
              >
                  <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                  <Text style={styles.saveBtnText}>
                      {isSaving ? "Saving..." : "Save Attempt"}
                  </Text>
              </Pressable>
          </View>
      </View>
  );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    scrollContent: {
        flexGrow: 1,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
    },
    sectionTitle: {
        fontFamily: "PoppinsBold",
        fontSize: 18,
        color: theme.primary,
        marginBottom: 16,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontFamily: "PoppinsMedium",
        fontSize: 14,
        color: theme.secondary,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 12,
        fontFamily: "Inter",
        fontSize: 14,
        color: theme.secondary,
        backgroundColor: theme.surfaceContainer,
        minHeight: 48,
        textAlignVertical: "top",
    },
    reflectionInput: {
        minHeight: 100,
    },
    radioGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.borderColor,
        backgroundColor: theme.surfaceContainer,
        minWidth: 100,
    },
    radioOptionSelected: {
        borderColor: theme.secondary,
        backgroundColor: theme.secondary + "10",
    },
    radioCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: theme.borderColor,
        marginRight: 8,
    },
    radioCircleSelected: {
        borderColor: theme.secondary,
        backgroundColor: theme.secondary,
    },
    radioText: {
        fontFamily: "Inter",
        fontSize: 14,
        color: theme.secondary,
    },
    dropdownContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    dropdownOption: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.borderColor,
        backgroundColor: theme.surfaceContainer,
    },
    dropdownOptionSelected: {
        borderColor: theme.secondary,
        backgroundColor: theme.secondary,
    },
    dropdownText: {
        fontFamily: "Inter",
        fontSize: 14,
        color: theme.secondary,
    },
    dropdownTextSelected: {
        color: "#fff",
    },
    ratingContainer: {
        marginTop: 16,
    },
    ratingLabel: {
        fontFamily: "PoppinsMedium",
        fontSize: 14,
        color: theme.secondary,
        marginBottom: 8,
    },
    ratingStars: {
        flexDirection: "row",
        gap: 8,
    },
    progressSection: {
        padding: 16,
        gap: 8,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    progressText: {
        fontFamily: "Inter",
        fontSize: 14,
        color: theme.secondary,
    },
    saveContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: theme.backgroundColor,
        borderTopWidth: 1,
        borderTopColor: theme.borderColor,
    },
    saveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 14,
        borderRadius: 10,
    },
    saveBtnText: {
        color: "#fff",
        fontFamily: "InterBold",
        fontSize: 14,
    },
});
