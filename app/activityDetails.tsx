import ActivityDetailsContents from "@/components/activityDetailsContents";
import Button from "@/components/button";
import { ActivityContext } from "@/context/ActivityContext";
import { ThemeContext } from "@/context/ThemeProvider";
import { ThemeColors } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityDetailsScreen(){
    const theme = useContext(ThemeContext)
    if (!theme) return null;
    const styles = createStyles(theme);
    const activityContext = useContext(ActivityContext);
    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;
    const router = useRouter();

    return(
        <SafeAreaView style={styles.outerContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <MaterialCommunityIcons size={24} name="arrow-left" color={theme.secondary} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Activity Details</Text>
                </View>
                <ActivityDetailsContents activity={activity} />
                <Button 
                    text={"Begin"}
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