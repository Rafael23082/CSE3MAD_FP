import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MemberAvatarProps {
  firstName: string;
  lastName: string;
}

export const MemberAvatar = ({ firstName, lastName }: MemberAvatarProps) => {
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

  const getBackgroundColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor(firstName + lastName) }]}>
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'InterBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});