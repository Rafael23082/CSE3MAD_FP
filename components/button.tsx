import { darkTheme, lightTheme, ThemeColors } from "@/theme/colors";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";

type ButtonProps = {
    text: string;
    action: () => void;
};

export default function Button({text, action}: ButtonProps){
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    const colors = isDark ? darkTheme: lightTheme;
    const styles = createStyles(colors);
    return(
        <Pressable 
            style={styles.button}
            onPress={()=> {action()}
        }>
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 14,
            width: "100%",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            alignSelf: "center"
        },
        buttonText: {
            color: "#FFFFFF",
            fontFamily: "InterSemiBold",
            width: "100%",
            textAlign: "center",
            lineHeight: 18
        }
    })
    return styles;
}