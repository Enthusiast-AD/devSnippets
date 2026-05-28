import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  const [searchText, setSearchText] = useState<string>('')

    // useEffect(()=>{

    // },[])
    const data = [
      {
        "id":1,
        "title":"React UseEffect Cleanup",
        "language":"javascript",
        "tags":["javascript","react"],
        "code":"useEffect(() => {\n  const timer = setInterval(() => {\n    console.log('running');\n  }, 1000);\n\n  return () => clearInterval(timer);\n}, []);",
        "isFavourite":false
      },
      {
        "id":2,
        "title":"Async Storage Setup",
        "language":"typescript",
        "tags":["react-native","storage"],
        "code":"import AsyncStorage from '@react-native-async-storage/async-storage';\n\nconst saveValue = async (value: string) => {\n  await AsyncStorage.setItem('my-key', value);\n};\n\nconst getValue = async () => {\n  const value = await AsyncStorage.getItem('my-key');\n  return value;\n};",
        "isFavourite":true
      },
      {
        "id":3,
        "title":"FlatList Render Item",
        "language":"javascript",
        "tags":["react-native","ui"],
        "code":"<FlatList\n  data={data}\n  keyExtractor={(item) => item.id}\n  renderItem={({ item }) => (\n    <View>\n      <Text>{item.title}</Text>\n    </View>\n  )}\n/>",
        "isFavourite":false
      },
      {
        "id":4,
        "title":"Search Input Debounce",
        "language":"typescript",
        "tags":["hooks","performance"],
        "code":"useEffect(() => {\n  const timeout = setTimeout(() => {\n    console.log(searchText);\n  }, 500);\n\n  return () => clearTimeout(timeout);\n}, [searchText]);",
        "isFavourite":false
      },
    ]
    const Header = () => (
      <>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Dev<Text style={styles.titleAccent}>Snippets</Text></Text>
            <Text style={styles.subtitle}>A tiny library of useful code bits</Text>
          </View>
          <Ionicons name="sparkles-outline" size={28} color="#A3FF3F" />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder='Search snippets, tags, language..'
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            accessibilityLabel="Search snippets"
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow}>
          <Pressable style={styles.actionCard} onPress={()=> router.push('/createSnippet')}>
            <Ionicons name="create-outline" size={22} color="#A3FF3F" />
            <Text style={styles.actionLabel}>New Snippet</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <Ionicons name="flash-outline" size={22} color="#A3FF3F" />
            <Text style={styles.actionLabel}>AI Explain</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <Ionicons name="folder" size={22} color="#FFB84D" />
            <Text style={styles.actionLabel}>File Manager</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Recent Snippets</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
      </>
    )

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item)=>item.id.toString()}
          renderItem={({item})=>(
            <Pressable style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Ionicons name={item.isFavourite ? "star" : "star-outline"} size={20} color={item.isFavourite ? "#A3FF3F" : "#6B7280"} />
              </View>
              <View style={styles.tagsRow}>
                {item.tags.map((tag,idx)=>(
                  <Text key={idx} style={styles.tag}>{tag}</Text>
                ))}
              </View>
            </Pressable>
          )}
          ListHeaderComponent={Header}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07070A',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: '#F5F7FA',
    fontSize: 22,
    fontWeight: '700',
  },
  titleAccent: {
    color: '#A3FF3F',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0F1117',
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#E6E6E6',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  actionsRow: {
    marginBottom: 18,
  },
  actionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#0F1117',
    borderRadius: 10,
    marginRight: 10,
    minWidth: 100,
  },
  actionLabel: {
    color: '#F5F7FA',
    marginTop: 8,
    fontSize: 13,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  viewAll: {
    color: '#A3FF3F',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#0F1117',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#F5F7FA',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tag: {
    color: '#A3FF3F',
    fontSize: 12,
    backgroundColor: '#080909',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 6,
  },
})