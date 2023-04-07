import { Text, View } from 'react-native';
import { Stack, useNavigation } from 'expo-router';

export default function Modal() {
  const navigation = useNavigation();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Modal player',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <Text onPress={navigation.goBack}>close</Text>,
        }}
      />
      <View style={{
        flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white',
      }}
      />
    </>
  );
}
