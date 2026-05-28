import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
    text: string;
    action: () => void;
};

export default function Button({text, action}: ButtonProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);

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
            fontFamily: "InterRegular",
            width: "100%",
            textAlign: "center",
            lineHeight: 18,
            fontSize: 16
        }
    })
    return styles;
}