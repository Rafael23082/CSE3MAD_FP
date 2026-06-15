import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
    first: boolean;
    label: string;
    text: string;
    setText: (text: string)=>void;
    placeholder: string;
    isPassword: boolean;
    isLabeled: boolean
    testID?: string
};

export default function InputGroup({first, label, text, setText, placeholder, isPassword, isLabeled, testID}: InputProps){
    const {theme} = useTheme();
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
                placeholderTextColor={theme.secondary}
                style={[styles.input, {
                    marginTop: isLabeled ? 15: 20,
                }]}
                value={text}
                onChangeText={setText}
                secureTextEntry={isPassword}
                autoCapitalize="none"
                autoCorrect={false}
                testID={testID}
            />
        </View>
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        input: {
            borderWidth: 1,
            borderColor: colors.inputBorderColor,
            color: colors.secondary,
            backgroundColor: colors.surfaceContainer,
            borderRadius: 5,
            padding: 12,
            fontSize: 16,
        },
        fieldLabel: {
            fontFamily: "InterRegular",
            color: colors.secondary,
            fontSize: 16
        }
    })
    return styles;
}