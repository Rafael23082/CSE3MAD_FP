import MemberCard from "@/components/memberCard";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from '@/theme/colors';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function MembersScreen() {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const {t} = useTranslation();

  const authContext = use(AuthContext);
  if (!authContext) return null;
  const {user} = authContext;

  const getTeamMembers = async() => {
    try{
      if (!user) return null;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const userData = userSnap.data();
      const teamId = userData?.teamId;

      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("teamId", "==", teamId)
      )

      const snapshot = await getDocs(q);

      const members = snapshot.docs.map((doc) => (
        doc.data()
      ))
      return members;
    }catch(err){
      console.log(err);
    }
  }

  const {data: members, isLoading} = useQuery({
    queryKey: ["members", user?.uid],
    queryFn: getTeamMembers,
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {!isLoading && members?.map((member, index) => (
          <MemberCard member={member} marginTop={index != 0} key={index} /> 
        ))}
        {isLoading && (
          <Text>{t("common.loading")}</Text>
        )}
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