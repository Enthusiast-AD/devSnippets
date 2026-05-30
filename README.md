# DevSnippets

DevSnippets is a local-first Expo app for creating, browsing, and opening code snippets on device. The app is designed to work offline and keeps snippet data on the device instead of depending on a remote backend.

## Database Structure

Snippets are stored as local records with the following shape:

- `id`
- `title`
- `language`
- `description`
- `code`
- `tags`
- `isFavourite`
- `createdAt`
- `updatedAt`

The current app stores the snippet collection in local storage backed by `expo-sqlite`, which keeps the data persistent across app restarts. The home screen loads that collection, and the detail screen reads a single snippet by id.

## Offline Storage Approach

All snippet reads and writes happen locally, so the core experience continues to work without internet access.

- New snippets are written locally when the user saves the create form.
- The home screen refreshes from the local store when the screen regains focus.
- The detail page reads directly from the same local source so the full snippet can be opened offline.

This gives the app a local-first data flow with no dependency on a remote API for snippet management.

## File Management Implementation

The app includes a local file manager built on Expo FileSystem. It lets users:

- Browse the workspace folders offline.
- Create local code files, template files, screenshot placeholders, and folders.
- Copy or move files between folders using a clipboard-style flow.
- Delete files and folders directly inside the app.

The workspace starts with dedicated folders for snippets, screenshots, templates, resources, and exports so the app has a predictable local structure.

## AI Integration Workflow

The AI workflow is designed around the selected snippet:

1. The user opens a snippet.
2. The app sends the snippet code and metadata to the chosen AI provider.
3. The provider returns an explanation, summary, or improvement suggestions.
4. The result is rendered beside the selected snippet in a readable format.


## Screens

- Home Screen
- Create Snippet Screen
- Snippet Details Screen
- Favorites Screen
- File Manager Screen
- Settings Screen


## All Screenshots in the Docs/Screenshots folder

- [Home Screen](docs/screenshots/Home.jpg)
- [Create Snippet Screen](docs/screenshots/CreateSnippet.jpg)
- [Snippet Details Screen](docs/screenshots/SnippetDetail.jpg)
- [AI Explanation Screen](docs/screenshots/AIExplanation.jpg)
- [Favorites Screen](docs/screenshots/Favourites.jpg)
- [File Manager Screen](docs/screenshots/FileManager.jpg)
- [Settings Screen](docs/screenshots/Settings.jpg)