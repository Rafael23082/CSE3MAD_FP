import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { useContext } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
    first: boolean;
    label: string;
    text: string;
    setText: (text: string)=>void;
    placeholder: string;
    isPassword: boolean;
    isLabeled: boolean
};

export default function InputGroup({first, label, text, setText, placeholder, isPassword, isLabeled}: InputProps){
    const theme = useContext(ThemeContext)
    if (!theme) return null;
    const styles = createStyles(theme);

    return(
        <View>
            {isLabeled && (
                <Text style={[styles.fieldLabel, {
                    paddingTop: first ? 40: 30
                }]}>{label}</Text>
            )}
            <TextInput
                placeholder={placeholder}
                style={[styles.input, {
                    marginTop: isLabeled ? 15: 20
                }]}
                value={text}
                onChangeText={setText}
                secureTextEntry={isPassword}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        input: {
            color: "#000000",
            backgroundColor: "#FFFFFF",
            borderRadius: 5,
            borderColor: "#000000",
            padding: 12,
            fontSize: 16
        },
        fieldLabel: {
            fontFamily: "InterRegular",
            color: colors.secondary,
            fontSize: 16
        }
    })
    return styles;
}