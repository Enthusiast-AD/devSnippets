import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { exportAllSnippetsToFile } from '@/lib/snippetExport'

const settings = () => {
  const appearanceItems = [
    { id: 'theme', label: 'Theme', value: 'Dark', icon: 'moon-outline' },
    { id: 'font', label: 'Font Size', value: 'Medium', icon: 'text-outline' },
  ]

  const storageItems = [
    { id: 'cache', label: 'Clear Cache', value: '24.5 MB', icon: 'trash-outline' },
    { id: 'database', label: 'Manage Database', icon: 'server-outline' },
    { id: 'export', label: 'Export All Data', subtitle: 'Backup your snippets', icon: 'download-outline' },
  ]

  const securityItems = [
    { id: 'api', label: 'Manage API Keys', icon: 'key-outline' },
    { id: 'lock', label: 'Change App Lock', value: 'PIN', icon: 'lock-closed-outline' },
  ]

  const aboutItems = [
    { id: 'about', label: 'About DevSnippets', value: 'v1.0.0', icon: 'information-circle-outline' },
  ]

  const Section = ({ title, items }: { title: string; items: Array<any> }) => (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Pressable
              key={item.id}
              style={[styles.row, !isLast && styles.rowDivider]}
              onPress={item.onPress}
              disabled={!item.onPress}
              android_ripple={{ color: '#1f2430' }}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons name={item.icon} size={16} color="#A3FF3F" />
                </View>
                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  {item.subtitle ? <Text style={styles.rowSubtitle}>{item.subtitle}</Text> : null}
                </View>
              </View>

              <View style={styles.rowRight}>
                {item.value ? <Text style={styles.rowValue}>{item.value}</Text> : null}
                <Ionicons name="chevron-forward" size={16} color="#505765" />
              </View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )

  const handleExportAll = () => {
    const exportedFile = exportAllSnippetsToFile()
    Alert.alert('Export complete', `Saved a local backup as ${exportedFile.name}`)
  }

  const storageItemsWithActions = storageItems.map((item) =>
    item.id === 'export' ? { ...item, onPress: handleExportAll } : item
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <Section title="Appearance" items={appearanceItems} />
      <Section title="Data & Storage" items={storageItemsWithActions} />
      <Section title="Security" items={securityItems} />
      <Section title="About" items={aboutItems} />
    </SafeAreaView>
  )
}

export default settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    color: '#F5F7FA',
    fontSize: 24,
    fontWeight: '700',
  },
  sectionWrap: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#8A909D',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    backgroundColor: '#161A22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#22262f',
    overflow: 'hidden',
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#22262f',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#1B1F28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextWrap: {
    flex: 1,
  },
  rowLabel: {
    color: '#F5F7FA',
    fontSize: 14,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    color: '#AEB4BF',
    fontSize: 12,
  },
})