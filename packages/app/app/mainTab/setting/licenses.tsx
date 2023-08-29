import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { memo } from 'react';
import licenses from '../../../assets/licenses.json';
import { Stack } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
// type LicenseType = {
//   licenses: string;
//   repository: string;
//   publisher: string;
//   email?: string;
//   url?: string;
//   name: string;
//   version: string;
//   description: string;
//   copyright: string;
//   licenseText: string;
//   [key: string]: string | undefined;
// };

// TODO: jsonファイルが大きすぎるので、Suspenseを使ってローディング表示を入れる
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
      <ScrollView style={styles.container}>
        {Object.keys(licenses).map((key, index) => {
          const license = licenses[key].licenses;
          const publisher = licenses[key].publisher;
          const licenseText = licenses[key].licenseText;
          const copyright = licenses[key].copyright;
          const displayValues = [
            {
              key: 'licenses',
              value: license,
            },
            {
              key: 'publisher',
              value: publisher,
            },
            {
              key: 'licenseText',
              value: licenseText,
            },
            {
              key: 'copyRight',
              value: copyright,
            },
          ];
          return (
            <View key={index} style={styles.licenseContainer}>
              {displayValues.map((v, i) => (
                <Text key={v.key} style={styles.textItem}>
                  {v.key}: {v.value}
                </Text>
              ))}
            </View>
          );
        })}
      </ScrollView>
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
