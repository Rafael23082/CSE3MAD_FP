import ContactSupportCard from "@/components/contactSupportCard";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from 'react-native';

export default function ContactSupportScreen() {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ContactSupportCard 
        label={t("contactSupport.customerService")}
        value="0813239423402"
        Icon={<MaterialCommunityIcons name="headset" size={24} />}
        marginTop={false}
      />
      <ContactSupportCard 
        label={t("contactSupport.writeUsAt")}
        value="matthew.staniswinata@binus.ac.id"
        Icon={<MaterialCommunityIcons name="email-outline" size={24} />}
        marginTop={true}
      />
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => {
  const styles = StyleSheet.create({
    container: {
      padding: 24,
      flexGrow: 1,
      backgroundColor: colors.backgroundColor,
    },
    body: {
        fontFamily: "InterRegular",
        color: colors.secondary,
        fontSize: 16
    }
  });
  return styles;
}