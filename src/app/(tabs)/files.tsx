import { Ionicons } from '@expo/vector-icons'
import { Directory, File } from 'expo-file-system'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
    WORKSPACE_DIRECTORY,
    buildBreadcrumbs,
    copyManagedFile,
    createManagedCodeFile,
    createManagedFolder,
    createManagedScreenshotPlaceholder,
    createManagedTemplateFile,
    deleteManagedEntry,
    ensureWorkspace,
    formatManagedStorageUsage,
    getFolderByName,
    listManagedEntries,
    moveManagedFile,
    type ClipboardEntry
} from '@/lib/fileManager'

function FilesScreen() {
  const [currentDirectory, setCurrentDirectory] = useState<Directory>(WORKSPACE_DIRECTORY)
  const [clipboard, setClipboard] = useState<ClipboardEntry | null>(null)
  const [revision, setRevision] = useState(0)
  const storage = formatManagedStorageUsage()

  useEffect(() => {
    ensureWorkspace()
    setRevision((value) => value + 1)
  }, [])

  const entries = useMemo(() => listManagedEntries(currentDirectory), [currentDirectory, revision])

  const refresh = () => {
    setRevision((value) => value + 1)
  }

  const goToRoot = () => {
    setCurrentDirectory(WORKSPACE_DIRECTORY)
  }

  const goUp = () => {
    if (currentDirectory.uri === WORKSPACE_DIRECTORY.uri) {
      return
    }

    setCurrentDirectory(currentDirectory.parentDirectory)
  }

  const openFolder = (folder: Directory) => {
    setCurrentDirectory(folder)
  }

  const handleCreateFolder = () => {
    createManagedFolder(currentDirectory)
    refresh()
  }

  const handleCreateCodeFile = () => {
    createManagedCodeFile(currentDirectory)
    refresh()
  }

  const handleCreateTemplateFile = () => {
    createManagedTemplateFile(currentDirectory)
    refresh()
  }

  const handleCreateScreenshot = () => {
    const screenshotsFolder = getFolderByName('Screenshots')
    createManagedScreenshotPlaceholder(screenshotsFolder)
    refresh()
  }

  const handlePasteHere = () => {
    if (!clipboard) {
      return
    }

    try {
      if (clipboard.operation === 'copy') {
        copyManagedFile(clipboard.item, currentDirectory)
      } else {
        moveManagedFile(clipboard.item, currentDirectory)
      }

      setClipboard(null)
      refresh()
    } catch (error) {
      Alert.alert('File operation failed', error instanceof Error ? error.message : 'Try a different destination.')
    }
  }

  const promptClipboardAction = (item: File, operation: ClipboardEntry['operation']) => {
    setClipboard({ item, operation })
  }

  const handleDelete = (item: File | Directory) => {
    Alert.alert('Delete item?', `Remove ${item.name} from local storage?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const deletedCurrentDirectory = item instanceof Directory && item.uri === currentDirectory.uri
          deleteManagedEntry(item)

          if (deletedCurrentDirectory) {
            setCurrentDirectory(WORKSPACE_DIRECTORY)
            refresh()
            return
          }

          refresh()
        },
      },
    ])
  }

  const breadcrumbs = buildBreadcrumbs(currentDirectory)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerIconWrap}>
          <Ionicons name="folder-open-outline" size={18} color="#A3FF3F" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>File Manager</Text>
          <Text style={styles.subtitle}>Browse, copy, move, and delete local files offline</Text>
        </View>
      </View>

      <View style={styles.storageSummary}>
        <Text style={styles.storageText}>
          {storage.usedLabel} used of {storage.totalLabel}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${storage.percentUsed}%` }]} />
        </View>
      </View>

      <View style={styles.breadcrumbRow}>
        <Pressable style={styles.crumbButton} onPress={goToRoot}>
          <Text style={styles.crumbText}>Workspace</Text>
        </Pressable>

        {breadcrumbs.slice(1).map((crumb) => (
          <Pressable key={crumb.uri} style={styles.crumbButton} onPress={() => setCurrentDirectory(crumb)}>
            <Text style={styles.crumbText}>{crumb.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actionGrid}>
        <Pressable style={styles.actionButton} onPress={handleCreateFolder}>
          <Ionicons name="folder-outline" size={18} color="#A3FF3F" />
          <Text style={styles.actionText}>Folder</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleCreateCodeFile}>
          <Ionicons name="code-slash-outline" size={18} color="#A3FF3F" />
          <Text style={styles.actionText}>Code File</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleCreateTemplateFile}>
          <Ionicons name="document-text-outline" size={18} color="#A3FF3F" />
          <Text style={styles.actionText}>Template</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleCreateScreenshot}>
          <Ionicons name="image-outline" size={18} color="#A3FF3F" />
          <Text style={styles.actionText}>Screenshot</Text>
        </Pressable>
      </View>

      {clipboard ? (
        <Pressable style={styles.pasteBanner} onPress={handlePasteHere}>
          <Ionicons name={clipboard.operation === 'copy' ? 'copy-outline' : 'move-outline'} size={16} color="#0B0B0B" />
          <Text style={styles.pasteText}>
            {clipboard.operation === 'copy' ? 'Copy here' : 'Move here'}: {clipboard.item.name}
          </Text>
        </Pressable>
      ) : null}

      {currentDirectory.uri !== WORKSPACE_DIRECTORY.uri ? (
        <Pressable style={styles.backButton} onPress={goUp}>
          <Ionicons name="arrow-up" size={16} color="#A3FF3F" />
          <Text style={styles.backButtonText}>Back to parent folder</Text>
        </Pressable>
      ) : null}

      <FlatList
        data={entries}
        keyExtractor={(item) => `${item.kind}:${item.item.uri}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={32} color="#6B7280" />
            <Text style={styles.emptyTitle}>No files here yet</Text>
            <Text style={styles.emptyText}>Create a local file or folder to start organizing resources.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isFolder = item.kind === 'folder'

          return (
            <Pressable
              style={styles.rowCard}
              onPress={() => {
                if (isFolder && item.item instanceof Directory) {
                  openFolder(item.item)
                }
              }}
            >
              <View style={styles.rowLeft}>
                <View style={styles.fileIconWrap}>
                  <Ionicons name={isFolder ? 'folder' : 'document-text'} size={22} color="#FFB84D" />
                </View>

                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowTitle}>{item.name}</Text>
                  <Text style={styles.rowSubtitle}>
                    {item.sizeLabel} • {item.modifiedLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.rowActions}>
                {!isFolder && item.item instanceof File ? (
                  <>
                    <Pressable style={styles.rowActionButton} onPress={() => promptClipboardAction(item.item, 'copy')}>
                      <Ionicons name="copy-outline" size={16} color="#A3FF3F" />
                    </Pressable>
                    <Pressable style={styles.rowActionButton} onPress={() => promptClipboardAction(item.item, 'move')}>
                      <Ionicons name="move-outline" size={16} color="#A3FF3F" />
                    </Pressable>
                  </>
                ) : null}

                <Pressable style={styles.rowActionButton} onPress={() => handleDelete(item.item)}>
                  <Ionicons name="trash-outline" size={16} color="#FF8D8D" />
                </Pressable>
              </View>
            </Pressable>
          )
        }}
      />
    </SafeAreaView>
  )
}

export default FilesScreen

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
    marginBottom: 12,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#12161D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F5F7FA',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  storageSummary: {
    marginBottom: 12,
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
  breadcrumbRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  crumbButton: {
    backgroundColor: '#10151C',
    borderWidth: 1,
    borderColor: '#22262f',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  crumbText: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10151C',
    borderWidth: 1,
    borderColor: '#22262f',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    color: '#F5F7FA',
    fontSize: 12,
    fontWeight: '700',
  },
  pasteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#A3FF3F',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  pasteText: {
    color: '#0B0B0B',
    fontSize: 13,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10151C',
    borderWidth: 1,
    borderColor: '#22262f',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '800',
    marginBottom: 2,
  },
  rowSubtitle: {
    color: '#6B7280',
    fontSize: 12,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  rowActionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#0F1117',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#22262f',
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
    textAlign: 'center',
  },
})