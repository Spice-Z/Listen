import { StyleSheet } from 'react-native';
import { memo } from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { WebView } from 'react-native-webview';
import { URL_LICENSES } from '../../../constants';

const licensesPage = memo(() => {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Licenses',
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.color.bgMain,
          },
        }}
      />
      <WebView style={styles.container} source={{ uri: URL_LICENSES }}></WebView>
    </>
  );
});

export default licensesPage;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#FFF',
  },
  licenseContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 16,
  },
  textItem: {
    marginBottom: 8,
  },
});
