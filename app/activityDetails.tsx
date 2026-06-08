import ActivityDetailsContents from "@/components/activityDetailsContents";
import Button from "@/components/button";
import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityDetailsScreen(){
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const {t} = useTranslation();
    const activityContext = use(ActivityContext);
    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor}}>
            <ScrollView
                style={styles.outerContainer}
                contentContainerStyle={[styles.container]}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <MaterialCommunityIcons size={24} name="arrow-left" color={theme.secondary} />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t("activities.activityDetails")}</Text>
                </View>
                <ActivityDetailsContents activity={activity} />
                <Button
                    text={t("buttons.begin")}
                    action={()=>{router.push("/activityAttempt")}}
                />
            </ScrollView>
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
            flexGrow: 1,
            padding: 24,
        },
        welcomeMessage: {
            fontFamily: "PoppinsBold",
            fontSize: 22,
            color: colors.primary,
            marginBottom: 24
        },
        sectionHeader: {
            fontFamily: "PoppinsRegular",
            fontSize: 20,
            color: colors.secondary,
            marginTop: 24
        },
        body: {
            fontFamily: "InterRegular",
            color: colors.secondary
        },
        equipmentContainer: {
            marginBottom: 32,
        },
        header: {
            flexDirection: "row",
            columnGap: 16,
            alignItems: "center",
            marginBottom: 24
        },
        backButton: {
            fontSize: 28,
            color: colors.secondary,
        },

        headerTitle: {
            fontFamily: "PoppinsRegular",
            fontSize: 18,
            color: colors.secondary,
        },
    });
    return styles;
}