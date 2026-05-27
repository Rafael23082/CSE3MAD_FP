import Button from "@/components/button";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen(){
    const { theme } = useTheme();
    const router = useRouter();
    const styles = createStyles(theme);
    const {t} = useTranslation();
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>STEMMLAB</Text>
                <Text style={styles.secondary}>{t("landing.slogan")}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button text={t("buttons.register")} action={()=>{router.push("/signup")}} />
                <Button text={t("buttons.login")} action={()=>{router.push("/login")}} />
            </View>
        </SafeAreaView >
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        container:{
            display: "flex",
            flex: 1,
            backgroundColor: colors.backgroundColor,
            padding: 24
        },  
        top: {
            flex: 1,
            display: "flex",
            justifyContent: "center",
        },
        title: {
            fontFamily: "PoppinsExtraBold",
            fontSize: 45,
            textAlign: "center",
            color: colors.primary
        },
        secondary: {
            fontFamily: "InterRegular",
            fontSize: 17,
            textAlign: "center",
            color: colors.secondary,
            marginTop: 10
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "column",
            rowGap: 20,
            width: "100%",
            alignItems: "center",
            marginBottom: 16
        }
    })
    return styles;
}