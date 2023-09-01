import { StyleSheet } from 'react-native';
import { memo } from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { WebView } from 'react-native-webview';
import { URL_TERMS_OF_SERVICES } from '../../../constants';

const TermsPage = memo(() => {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Terms of Services',
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.color.bgMain,
          },
        }}
      />
      <WebView style={styles.container} source={{ uri: URL_TERMS_OF_SERVICES }}></WebView>
    </>
  );
});

export default TermsPage;

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
