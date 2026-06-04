import { getActivities } from "@/assets/activities";
import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type activityScreenProps = {
    activityKey: string,
    activityName: string,
    description: string,
    imagePath: any,
    onlyImage: boolean
}

export default function ActivityGroup({activityKey, activityName, description, imagePath, onlyImage}: activityScreenProps){
    const router = useRouter(); 
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const {t} = useTranslation();
    const activities = getActivities(t);

    const activityContext = use(ActivityContext);
    if (!activityContext) return null;
    const { setActivity } = activityContext;

    return (
        onlyImage ? (
            <View style={styles.activityBox}>
                <Image source={imagePath} style={styles.image} resizeMode="cover" />
            </View>
        ) : (
            <View style={styles.activityContainer}>
            <Text style={styles.sectionHeader}>{activityName}</Text>
            <Pressable
                style={[styles.activityBox, {
                    marginVertical: 16
                }]}
                onPress={() => {
                    setActivity(activities[activityKey]);
                    router.push("/activityDetails")
                }}
            >
                <Image source={imagePath} style={styles.image} resizeMode="cover" />
            </Pressable>
            <Text style={styles.body}>{description}</Text>
            <Text style={[styles.body, { paddingTop: 4 }]}>Rating: 4.8</Text>
            </View>
        )
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        activityContainer: {
            marginTop: 24
        },
        activityBox: {
            width: "100%",
            height: 200,
            borderRadius: 16,
            borderColor: colors.borderColor,
            borderWidth: 1,
            overflow: "hidden"
        },
        body: {
            fontFamily: "InterRegular",
            color: colors.secondary,
            fontSize: 16
        },
        sectionHeader: {
            color: colors.secondary,
            fontFamily: "PoppinsRegular",
            fontSize: 20,
        },
        image: {
            width: "100%",
            height: "100%",
        }
    })
    return styles;
}