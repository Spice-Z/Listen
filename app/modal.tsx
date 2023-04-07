import { Text, View } from "react-native";
import { Link, Stack, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Modal() {
  const navigation = useNavigation();
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = navigation.canGoBack();

  return (
    <>
    <Stack.Screen
        options={{
          headerTitle: 'Modal player',
          headerLeft: () => <Text onPress={navigation.goBack}>close</Text>,
        }}
      />
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
    </View>
    </>
  );
}