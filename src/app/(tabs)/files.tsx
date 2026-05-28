import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const files = () => {
  const storageUsed = 12.4
  const storageTotal = 32

  const fileItems = [
    { id: '1', name: 'Snippets Exports', count: '24 items', size: '2.1 GB', type: 'folder' },
    { id: '2', name: 'Screenshots', count: '5 items', size: '1.8 GB', type: 'folder' },
    { id: '3', name: 'Code Files', count: '43 items', size: '3.4 GB', type: 'folder' },
    { id: '4', name: 'Templates', count: '12 items', size: '1.2 GB', type: 'folder' },
    { id: '5', name: 'Resources', count: '9 items', size: '1.0 GB', type: 'folder' },
    { id: '6', name: 'readme.txt', count: '1.2 KB', size: '2 days ago', type: 'file' },
  ]

  const progressWidth = `${Math.min((storageUsed / storageTotal) * 100, 100)}%`

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerIconWrap}>
          <Ionicons name="grid-outline" size={18} color="#A3FF3F" />
        </View>
        <Text style={styles.title}>File Manager</Text>
      </View>

      <View style={styles.storageSummary}>
        <Text style={styles.storageText}>{storageUsed} GB of {storageTotal} GB used</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      <FlatList
        data={fileItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.rowCard}>
            <View style={styles.rowLeft}>
              <View style={styles.fileIconWrap}>
                <Ionicons
                  name={item.type === 'folder' ? 'folder' : 'document-text'}
                  size={22}
                  color="#FFB84D"
                />
              </View>

              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={styles.rowSubtitle}>{item.count}</Text>
              </View>
            </View>

            <Text style={styles.rowSize}>{item.size}</Text>
          </View>
        )}
      />

      <View style={styles.fab}>
        <Ionicons name="add" size={30} color="#0B0B0B" />
      </View>
    </SafeAreaView>
  )
}

export default files

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  headerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#12161D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F5F7FA',
    fontSize: 24,
    fontWeight: '700',
  },
  storageSummary: {
    marginBottom: 16,
  },
  storageText: {
    color: '#AEB4BF',
    fontSize: 13,
    marginBottom: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#20242C',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#A3FF3F',
  },
  listContent: {
    paddingBottom: 92,
  },
  rowCard: {
    backgroundColor: '#161A22',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#22262f',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1B1F28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    color: '#F5F7FA',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  rowSubtitle: {
    color: '#6B7280',
    fontSize: 12,
  },
  rowSize: {
    color: '#AEB4BF',
    fontSize: 12,
    marginLeft: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 88,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#A3FF3F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A3FF3F',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
})