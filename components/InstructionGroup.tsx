import { darkTheme, lightTheme, ThemeColors } from "@/theme/colors";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";

type InputProps = {
    text: string,
    videoPath: any,
    number: number
};

export default function InstructionGroup({text, videoPath, number}: InputProps){
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    const colors = isDark ? darkTheme: lightTheme;
    const styles = createStyles(colors);
    return(
        <View style={styles.container}>
            <Text style={styles.body}>{number}. {text}</Text>
            <View style={styles.instructionBox}>
                <Image source={videoPath} style={styles.video} resizeMode="cover" />
            </View>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        instructionBox: {
            width: "100%",
            height: 200,
            borderRadius: 16,
            borderColor: colors.borderColor,
            borderWidth: 1,
            overflow: "hidden",
            marginTop: 16
        },
        body: {
            fontFamily: "InterRegular",
            color: colors.secondary,
            paddingTop: 16,
        },
        container: {
            marginBottom: 24
        },
        video: {
            width: "100%",
            height: "100%",
        }
    })
    return styles;
}