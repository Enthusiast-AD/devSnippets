import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const favouritesData = [
  { id: '1', title: 'Debounce Function in JavaScript', tags: ['javascript', 'functions', 'performance'], language: 'javascript' },
  { id: '2', title: 'React useEffect Cleanup', tags: ['react', 'hooks'], language: 'typescript' },
  { id: '3', title: 'Python FastAPI Example', tags: ['python', 'fastapi', 'api'], language: 'python'},
  { id: '4', title: 'CSS Glassmorphism Card', tags: ['css', 'ui', 'design'], language: 'css' },
  { id: '5', title: 'JWT Auth Middleware', tags: ['javascript', 'express', 'auth'], language: 'js' },
]
const favourites = () => {
    const [searchText,setSearchText] = useState('')

    const filteredData = favouritesData.filter((item) => {
      const query = searchText.trim().toLowerCase()
      if (!query) {
        return true
      }

      return (
        item.title.toLowerCase().includes(query) ||
        item.language.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })

    const getLanguageIcon = (language: string) => {
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          return 'logo-javascript'
        case 'typescript':
        case 'ts':
          return 'code-slash'
        case 'python':
          return 'logo-python'
        case 'css':
          return 'logo-css3'
        case 'react':
          return 'logo-react'
        default:
          return 'code-slash'
      }
    }

    const getLanguageAccent = (language: string) => {
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          return '#F7DF1E'
        case 'typescript':
        case 'ts':
          return '#3178C6'
        case 'python':
          return '#3776AB'
        case 'css':
          return '#264DE4'
        case 'react':
          return '#61DAFB'
        default:
          return '#A3FF3F'
      }
    }
  return (
    <SafeAreaView style={styles.container}>
        <View style={{marginBottom:14}}>
            <Text style={{color:'#F5F7FA',fontSize:24,fontWeight:'bold'}}>Favourites</Text>
            <Text style={{color:'#6B7280',marginTop:4}}>Saved snippets and quick references</Text>
        </View>
        <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B6B6B" />
        <TextInput
          placeholder='Search snippets, tags, language..'
          placeholderTextColor="#bdbaba"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
      data={filteredData}
      keyExtractor={(item)=>item.id.toString()}
      contentContainerStyle={{paddingBottom: 20}}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={32} color="#6B7280" />
          <Text style={styles.emptyTitle}>No favourites found</Text>
          <Text style={styles.emptyText}>Try a different search term.</Text>
        </View>
      }
      renderItem={({item})=>(
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.languageBadge}>
              <View style={[styles.languageIconWrap, { backgroundColor: `${getLanguageAccent(item.language)}20` }]}>
                <Ionicons name={getLanguageIcon(item.language)} size={18} color={getLanguageAccent(item.language)} />
              </View>
              <View style={{flex:1}}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.languageText}>{item.language}</Text>
              </View>
            </View>
            <Ionicons name="star" size={18} color="#A3FF3F" />
          </View>

          <View style={styles.tagRow}>
            {item.tags.map((tag) => (
              <Text key={tag} style={styles.tagChip}>{tag}</Text>
            ))}
          </View>
        </View>
      )}
      />
    </SafeAreaView>
  )
}

export default favourites

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "black",
        color: "white",
    padding:10
    },
    searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 14,
    backgroundColor: '#1a1919',
    // borderWidth: 1,
    // borderColor: '#E6E6E6',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#ccc9c9',
    fontSize: 14,
    backgroundColor: '#161A22'
  },
  card: {
    backgroundColor: '#161A22',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#22262f',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  languageIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  languageText: {
    color: '#A3FF3F',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    color: '#A3FF3F',
    fontSize: 12,
    backgroundColor: '#0F1117',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
  },
})