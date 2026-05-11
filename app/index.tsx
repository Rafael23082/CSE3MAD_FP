import Button from "@/components/button";
import { ThemeContext } from "@/context/ThemeProvider";
import { ThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen(){
    const theme = useContext(ThemeContext);
    if (!theme) return null;
    const router = useRouter();
    const styles = createStyles(theme);
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <Text 
                    style={styles.title}>STEMMLAB</Text>
                <Text 
                    style={styles.secondary}>Experiment. Measure. Improve.</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button text={"Register"} action={()=>{router.push("/signup")}} />
                <Button text={"Login"} action={()=>{router.push("/login")}} />
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