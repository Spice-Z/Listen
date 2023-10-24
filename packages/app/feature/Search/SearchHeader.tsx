import { useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../styles/theme';
import PressableOpacity from '../Pressable/PressableOpacity';
import SearchLensIcon from '../icons/SearchLensIcon';
import PressableScale from '../Pressable/PressableScale';
import RightArrowIcon from '../icons/RightArrowIcon';
import CloseIcon from '../icons/CloseIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchHeader = memo(() => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchInputVisible, setSearchInputVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const onChangeText = useCallback((text: string) => {
    setSearchText(text);
  }, []);
  const onSearch = useCallback(() => {
    router.push({ pathname: 'mainTab/search/searchResult', params: { searchText } });
  }, [router, searchText]);
  const showSearchInput = () => {
    setSearchInputVisible(true);
  };
  const hideSearchInput = () => {
    setSearchInputVisible(false);
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {!searchInputVisible ? (
          <>
            <View style={styles.close} />
            <Text style={styles.title}>Search</Text>
            <PressableOpacity onPress={showSearchInput}>
              <SearchLensIcon width={20} height={20} color={theme.color.accent} />
            </PressableOpacity>
          </>
        ) : (
          <>
            <PressableOpacity style={styles.close} onPress={hideSearchInput}>
              <CloseIcon width={24} height={24} color={theme.color.textWeak} />
            </PressableOpacity>
            <TextInput
              style={styles.input}
              value={searchText}
              onChangeText={onChangeText}
              autoFocus
            />
            <PressableScale onPress={onSearch}>
              <RightArrowIcon width={20} height={20} color={theme.color.accent} />
            </PressableScale>
          </>
        )}
      </View>
    </View>
  );
});

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.color.bgMain,
    paddingHorizontal: 8,
  },
  content: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.color.textMain,
    fontWeight: theme.fontWeight.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  searchIcon: {
    width: 28,
    height: 28,
    backgroundColor: 'black',
  },
  input: {
    backgroundColor: theme.color.bgEmphasis,
    width: '70%',
    padding: 8,
  },
  close: {
    width: 24,
  },
});
