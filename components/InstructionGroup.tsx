import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { Image, StyleSheet, Text, View } from "react-native";

type InputProps =
 {
    texts: string[],
    imagePath: any
};

export default function InstructionGroup({texts, imagePath}: InputProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    return(
        <View style={styles.container}>
            {texts.map((text, index) => (
                <Text 
                    style={[styles.body, {
                        paddingTop: index == 0 ? 16: 16
                    }]}
                    key={index}
                >{index + 1}. {text}</Text>
            ))}
            <View style={styles.instructionBox}>
                <Image source={imagePath} style={styles.image} resizeMode="cover" />
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
            marginTop: 24
        },
        body: {
            fontFamily: "InterRegular",
            color: colors.secondary,
            fontSize: 16
        },
        container: {
            marginBottom: 24
        },
        image: {
            width: "100%",
            height: "100%",
        }
    })
    return styles;
}