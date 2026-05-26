import Button from "@/components/button";
import Card from "@/components/card";
import { ActivityContext } from "@/context/ActivityContext";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ActivityResults = {
        label: string,
        value: string
    }

export default function ActivityResultsScreen(){
    const theme = useContext(ThemeContext);
    if (!theme) return null;
    const styles = createStyles(theme);

    const activityContext = useContext(ActivityContext);
    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;

    const params = useLocalSearchParams();
    const results = params.results ? JSON.parse(params.results as string): [];
    const router = useRouter();
    const {t} = useTranslation();

    return(
        <SafeAreaView style={styles.outerContainer}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.head}>{activity.name}</Text>
                    <Text style={styles.sectionHeader}>{t("activities.activityResults")}</Text>
                    <View style={styles.cardContainer}>
                        {results.map((item: ActivityResults, index: number) => (
                            <Card metric={item.label} value={String(item.value)} maximumWidth={true} key={index} />
                        ))}
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button text={t("buttons.backToActivities")} action={()=>{router.push("/(tabs)/activities")}} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
} 

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        outerContainer: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },
        container: {
            padding: 24,
            flexGrow: 1
        },
        head: {
          fontFamily: "PoppinsBold",
          fontSize: 22,
          color: colors.primary,
          marginBottom: 24
        },
        sectionHeader: {
            fontFamily: "PoppinsRegular",
            fontSize: 20,
            color: colors.secondary,
            marginBottom: 16,
        },
        cardContainer: {
            display: "flex",
            flexDirection: "column",
            rowGap: 16
        },
        subContainer: {
            flexGrow: 1
        },
        buttonContainer: {
            marginTop: 32
        }
    });
    return styles;
}