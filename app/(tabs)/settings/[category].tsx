import AboutSettingsScreen from "@/components/aboutSettingsScreen";
import AccountSettingsScreen from "@/components/accountSettingsScreen";
import AppearanceSettingsScreen from "@/components/appearanceSettingsScreen";
import TeamSettingsScreen from "@/components/teamSettingsScreen";
import { useLocalSearchParams } from "expo-router";

export default function SettingsCategoryScreen(){
  const { category } = useLocalSearchParams();

  const renderScreen = () => {
    switch (category) {
      case "account":
        return <AccountSettingsScreen />;

      case "team":
        return <TeamSettingsScreen />;

      case "appearance":
        return <AppearanceSettingsScreen />;

      case "about":
        return <AboutSettingsScreen />;

      default:
        return null;
    }
  };

  return renderScreen();
}