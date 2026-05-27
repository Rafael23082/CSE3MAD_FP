import { Activity } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import ActivityGroup from "./activityGroup";
import EquipmentCard from "./equipmentCard";

type Props = {
    activity: Activity;
};

export default function ActivityDetailsContents({ activity }: Props) {
    const {theme} = useTheme();
    const styles = createStyles(theme);

    const {t} = useTranslation();

    return (
        <View>
            <Text style={styles.welcomeMessage}>
                {activity.name}
            </Text>
            
            <ActivityGroup
                activityKey="placeholder"
                activityName="placeholder"
                description="placeholder"
                imagePath={activity.image}
                onlyImage={true}
            />
            <Text style={styles.sectionHeader}>{t("activities.overview")}</Text>
            <Text style={styles.body}>{activity.description}</Text>
            <Text style={styles.sectionHeader}>{t("activities.equipmentsNeeded")}</Text>

            <View style={styles.equipmentContainer}>
                {activity.equipments.map((equipment, index) => (
                    <EquipmentCard
                        key={index}
                        toolName={equipment.toolName}
                        description={equipment.description}
                        image={equipment.image}
                    />
                ))}
            </View>
        </View>
    );
    }

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
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
            color: colors.secondary,
            fontSize: 16
        },
        equipmentContainer: {
            marginBottom: 32,
        }
    });
    return styles;
}