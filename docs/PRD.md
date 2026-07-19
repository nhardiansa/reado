# PRD — Reado

## Mobile Android Book Reading Tracker App

---

## 1. Overview

Reado is a mobile Android application that helps users record their personal book collection, track reading progress, store simple notes, and share their reading journey in attractive visual formats. The app is built with Expo and React Native using a local-first approach, so core features remain usable without an internet connection and without a user account.

The primary problem Reado solves is the difficulty of tracking books a user wants to read, is currently reading, has finished, has paused, or has dropped. Reado provides a simple way to store book data, update the last page read, view progress as a percentage, and manage a personal reading list.

Beyond personal tracking, Reado also encourages users to feel more confident sharing their reading experience. Users can generate a share card for in-progress books or finished books, then share it to social media such as Instagram via the Android share sheet.

Visually, Reado uses a claymorphism style: large rounded corners, thick borders, pastel colors, and black shadows with offsets that create a playful, tactile, and modern feel.

---

## 2. Problem Statement

Many readers track reading progress separately across manual notes, spreadsheets, generic apps, or simply rely on memory. This often causes users to forget which book they are reading, the last page they read, or which books they have finished.

In addition, many readers lack an easy and attractive way to share their reading experience. Sharing progress, finished-book milestones, or the reading journey often feels cumbersome because users must design their own visuals in another app.

Reado aims to deliver a reading-tracker experience that is lightweight, personal, fast to use, easy to share, and independent of accounts or internet connectivity.

---

## 3. Goals

- Help users record books they want to read, are reading, and have read.
- Make it easy to update reading progress based on the last page read.
- Display progress percentage automatically and accurately.
- Provide a book list that can be filtered by reading status.
- Store data locally so the app remains usable offline.
- Help users share reading progress and finished-book achievements in a visual format attractive for social media.
- Encourage users to build a reading habit by making progress sharing feel easy, fun, and not embarrassing.
- Provide a consistent, attractive, and easy-to-use claymorphism UI.
- Keep the MVP simple so it can be built and validated quickly.

---

## 4. Non-Goals

The following are out of scope for the MVP:

- Login/register.
- Multi-user.
- Cloud sync.
- Multi-device sync.
- In-app social features such as feed, follow, comments, likes, or public profiles.
- Import data from Goodreads, StoryGraph, or other external services.
- Barcode scanner for ISBN.
- Fetch book metadata from external APIs.
- Reminder notifications.
- Complex reading statistics.
- Android widgets.
- Marketplace, automatic book recommendations, or community features.

---

## 5. Target Users

The primary MVP target is personal readers who want to track reading progress simply, without an account and without internet.

User characteristics:

- Reads one or several books at a time.
- Wants to know which books are currently being read, finished, want-to-read, paused, or dropped.
- Needs a quick way to update the last page read.
- Wants to share reading progress or achievements to social media in an attractive visual format.
- Needs a simple private note for each book.
- Does not need in-app social features or sync at this stage.

---

## 6. Product Scope

### 6.1 Must Have — MVP Core

Required features for the first version:

1. Book list / library.
2. Add a new book.
3. Edit book data.
4. Delete a book with confirmation.
5. Book detail.
6. Update last-page-read progress.
7. Automatic progress percentage calculation.
8. Filter books by reading status.
9. Simple search by title or author.
10. Single-text-field private note per book.
11. Local data storage.
12. Share progress card for in-progress books.
13. Share finished book card for finished-book achievements.
14. Consistent basic claymorphism UI.

### 6.2 Should Have — MVP Plus

Features that should exist if development time allows:

1. Compact dashboard showing total books, currently-reading count, and finished count.
2. Personal rating.
3. Book genre or category.
4. Sort by last updated, title A-Z, highest progress, or highest rating.
5. Reading progress update history.
6. Share a quote or short reflection from a private note.
7. Multiple visual templates for share cards.

### 6.3 Could Have — Post-MVP Early Enhancements

Useful but not required for the initial release:

1. Local backup export/import.
2. Simple statistics of finished books per month.
3. Weekly or monthly reading targets.
4. Custom theme.
5. Local book cover image.
6. Custom caption for share cards.

### 6.4 Won't Have — Out of Scope for MVP

- Login/register.
- Cloud sync.
- Multi-device sync.
- Reminder notifications.
- ISBN scanner.
- Book metadata API.
- In-app social features such as feed, follow, comments, likes, or public profiles.
- Complex statistics.

---

## 7. Platform and Technical Requirements

### 7.1 Platform

- The app is built with Expo SDK 57 and React Native 0.86, using TypeScript.
- Initial target is Android mobile.
- The app is optimized for portrait mode.
- All core features must work without an internet connection.

### 7.2 Local Storage Decision

For the MVP, the recommended local database is WatermelonDB.

Reasons:

- Well-suited for offline-first React Native apps.
- Built on SQLite, with lazy loading and reactive queries that perform well for large collections.
- Supports schema migrations, which prepares the app for advanced features (statistics, progress history, complex search).
- Reactive API integrates naturally with React components.

MMKV is used only for simple preferences such as theme configuration or lightweight settings, replacing the role SharedPreferences plays in a Flutter app.

> Note: WatermelonDB ships a native module, so the app cannot run inside Expo Go. Use a development build via `expo run:android` or an EAS Build `development` profile.

---

## 8. Functional Requirements

### 8.1 Library / Reading List

The user can view the list of books stored locally.

Main content:

- Book title.
- Author if available.
- Reading status.
- Current page and total pages.
- Progress percentage.
- Visual progress indicator.

Features:

- Filter by status.
- Search by title or author.
- Default sort by most recent `updatedAt`.
- Empty state when no books exist yet.
- Empty result state when a search returns no matches.

### 8.2 Add Book

The user can add a new book.

MVP Core fields:

- Title — required.
- Author — optional.
- Total pages — required.
- Current page — required, default 0.
- Reading status — required.
- Private note — optional.

MVP Plus fields:

- Genre/category.
- Personal rating.

Validation:

- Title is required and must not be empty after trim.
- Total pages must be greater than 0.
- Current page must be between 0 and total pages.
- Rating, if provided, must be in the range 0 to 5.

### 8.3 Edit Book

The user can edit an existing book's data.

Rules:

- All Add Book validations still apply.
- If total pages is changed to a value smaller than the current page, the user must adjust the current page first.
- Any data change updates `updatedAt`.

### 8.4 Delete Book

The user can delete a book from local storage.

Rules:

- The system must show a confirmation dialog before deleting.
- If the user cancels, data does not change.
- If the user confirms, the book is deleted and the user returns to the book list.

### 8.5 Book Detail

The detail screen shows the full information of a single book.

Information shown:

- Book title.
- Author if available.
- Reading status.
- Total pages.
- Current page.
- Progress percentage.
- Private note.
- Created date.
- Last updated date.
- Start-reading date if available.
- Finish-reading date if available.
- Genre and rating if the MVP Plus features are enabled.

Actions:

- Edit book.
- Update progress.
- Share progress.
- Share finished-book achievement if status is Finished.
- Change status.
- Edit note.
- Delete book.

### 8.6 Update Reading Progress

The user can update the last page read.

Input:

- Last page read.
- Optional update note if progress history is enabled.

Output:

- `currentPage` is updated.
- Progress percentage is recalculated.
- `updatedAt` is updated.
- Status may change according to business rules.

Formula:

```text
progress = currentPage / totalPages * 100
```

Example:

```text
currentPage = 120
totalPages = 300
progress = 40%
```

### 8.7 Reading Notes

For MVP Core, the note is stored as a single long text field inside the book record.

Rules:

- The note may be empty.
- The note can be edited from the book detail or the edit-book form.
- Granular per-page or per-chapter notes are not part of the MVP.

### 8.8 Dashboard Summary

A full dashboard belongs to MVP Plus. For MVP Core, the library screen may display a small summary at the top.

Minimum summary:

- Total books.
- Number of books currently being read.
- Number of finished books.

### 8.9 Share Progress

The user can share reading progress as a visual card that can be sent to other apps via the Android share sheet.

MVP Core share types:

1. Progress Share Card
   - Used for in-progress or unfinished books.
   - Shows book title, author if available, reading status, current page, total pages, and progress percentage.
   - Progress is the primary visual element.

2. Finished Book Share Card
   - Used for books with status Finished.
   - Shows book title, author if available, finish date if available, 100% progress, and rating if the rating feature is enabled.
   - Emphasizes the finished-book milestone moment.

Output:

- The system generates a share-card image.
- The system shows a preview before the user shares the card.
- The user can share the image via the Android share sheet to apps such as Instagram, WhatsApp, or any other app that supports image sharing.
- Share-card design follows the claymorphism style.
- The primary share-card aspect ratio is optimized for Instagram Story, i.e. 9:16.
- The MVP share card does not display the private note automatically.

---

## 9. Reading Status and Business Rules

### 9.1 Reading Status

Each book has one status:

- Want to Read.
- Reading.
- Finished.
- Paused.
- Dropped.

### 9.2 Business Rules

- A new book defaults to `currentPage = 0` unless the status is set directly to Finished.
- `currentPage` must be between 0 and `totalPages`.
- If status is set to Want to Read, `currentPage` is recommended to be 0.
- If status is set to Finished, `currentPage` automatically becomes equal to `totalPages`.
- If `currentPage` reaches `totalPages`, the system automatically changes status to Finished.
- If status changes to Reading and `startedAt` is still empty, the system fills `startedAt` with the current date.
- If status changes to Finished and `finishedAt` is still empty, the system fills `finishedAt` with the current date.
- If status changes from Finished to another status, the system asks for confirmation and clears `finishedAt` after the user confirms.
- Any book data change updates `updatedAt`.

---

## 10. Core User Flows

### 10.1 First Open / Empty State

1. The user opens the app for the first time.
2. The system shows the empty state "No books yet".
3. The system shows a "Add your first book" CTA.
4. The user adds a book.
5. The book appears in the list.

### 10.2 Add Book Flow

1. The user opens the app.
2. The user taps "Add Book".
3. The user fills required fields.
4. The user selects a reading status.
5. The system validates.
6. If valid, the system saves the book.
7. The book appears in the list under its status.

### 10.3 Update Progress Flow

1. The user opens the book detail or selects update-progress from the list.
2. The user enters the last page read.
3. The system validates the page.
4. The system recalculates the progress percentage.
5. The system saves the change.
6. The book view updates.

### 10.4 Finish Book Flow

1. The user updates the current page to equal the total pages.
2. The system shows 100% progress.
3. The system automatically changes status to Finished.
4. The system saves `finishedAt`.

### 10.5 Delete Book Flow

1. The user opens the book detail.
2. The user taps the delete button.
3. The system shows a confirmation dialog.
4. If the user confirms, the system deletes the book.
5. The user returns to the book list.

### 10.6 Search Empty Result Flow

1. The user types a search keyword.
2. The system finds no matching book.
3. The system shows a "Book not found" message.
4. The system provides an option to clear the search.

### 10.7 Share Progress Flow

1. The user opens the detail of an unfinished book.
2. The user taps "Share Progress".
3. The system shows a preview of the progress share card.
4. The user taps "Share".
5. The system opens the Android share sheet.
6. The user picks a destination app such as Instagram, WhatsApp, or another app.

### 10.8 Share Finished Book Flow

1. The user finishes a book or opens the detail of a book with status Finished.
2. The system shows a "Share Achievement" CTA.
3. The user taps that CTA.
4. The system shows a preview of the finished-book share card.
5. The user taps "Share".
6. The system opens the Android share sheet.
7. The user picks a destination app such as Instagram, WhatsApp, or another app.

---

## 11. Data Model

### 11.1 Book

```ts
export type ReadingStatus = "wantToRead" | "reading" | "finished" | "paused" | "dropped";

export interface Book {
  id: string;
  title: string;
  author: string | null;
  totalPages: number;
  currentPage: number;
  status: ReadingStatus;
  genre: string | null;
  rating: number | null;
  notes: string | null;
  coverImagePath: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  startedAt: string | null; // ISO 8601
  finishedAt: string | null; // ISO 8601
}
```

| Field          | Type           | Required | Description                    |
| -------------- | -------------- | -------: | ------------------------------ |
| id             | string         |      Yes | Unique book ID                 |
| title          | string         |      Yes | Book title                     |
| author         | string \| null |       No | Author name                    |
| totalPages     | number         |      Yes | Total pages                    |
| currentPage    | number         |      Yes | Last page read                 |
| status         | ReadingStatus  |      Yes | Reading status                 |
| genre          | string \| null |       No | Genre/category, MVP Plus       |
| rating         | number \| null |       No | Personal rating, MVP Plus      |
| notes          | string \| null |       No | Private note                   |
| coverImagePath | string \| null |       No | Local cover path, post-MVP     |
| createdAt      | string         |      Yes | Created date (ISO 8601)        |
| updatedAt      | string         |      Yes | Last-updated date (ISO 8601)   |
| startedAt      | string \| null |       No | Start-reading date (ISO 8601)  |
| finishedAt     | string \| null |       No | Finish-reading date (ISO 8601) |

Constraints:

- `title.trim()` must not be empty.
- `totalPages > 0`.
- `0 <= currentPage <= totalPages`.
- `rating == null` or `0 <= rating <= 5`.
- `updatedAt` changes whenever book data changes.

> The interface above is the domain model used across the app. The WatermelonDB `Model` class is a persistence-layer detail that lives behind the repository and is not imported outside `db/` and `repositories/`.

### 11.2 ReadingProgressLog — MVP Plus

Progress history is not required for MVP Core. If enabled, use the following model:

```ts
export interface ReadingProgressLog {
  id: string;
  bookId: string;
  fromPage: number;
  toPage: number;
  note: string | null;
  createdAt: string; // ISO 8601
}
```

| Field     | Type           | Required | Description            |
| --------- | -------------- | -------: | ---------------------- |
| id        | string         |      Yes | Unique log ID          |
| bookId    | string         |      Yes | Relation to book       |
| fromPage  | number         |      Yes | Page before update     |
| toPage    | number         |      Yes | Page after update      |
| note      | string \| null |       No | Update-progress note   |
| createdAt | string         |      Yes | Update date (ISO 8601) |

The reason for storing both `fromPage` and `toPage` is so that pages-read-per-update statistics can be computed more clearly in later versions.

---

## 12. UX/UI Direction

### 12.1 Visual Style

Reado uses claymorphism with these characteristics:

- Large rounded corners.
- Thick dark-colored borders.
- Black shadows with a bottom-right offset.
- Pastel background colors.
- Playful cards and buttons.
- Components feel like clay/plastic objects raised from the surface.

### 12.2 Design Tokens

```text
Primary Background: #F8EFD9
Primary Accent: #FFB84C
Secondary Accent: #A3D8F4
Success: #9BE7A1
Danger: #FF8A8A
Text Primary: #1E1E1E
Border: #1E1E1E
Shadow: rgba(0, 0, 0, 0.85)
Card Background: #FFF7E6
```

Spacing:

```text
xs: 4
sm: 8
md: 16
lg: 24
xl: 32
```

Radius:

```text
card: 24
button: 20
modal: 28
```

Border:

```text
standard: 2
emphasized: 3
```

Shadow:

```text
default offset: 4, 4
emphasized offset: 6, 6
blurRadius: 0
```

These tokens are exported from `src/theme/tokens.ts` and mirrored in `tailwind.config.js` so they are available both as TypeScript constants and as Tailwind utility classes (e.g. `bg-clay-bg`, `border-clay`, `shadow-clay`).

### 12.3 React Native Component Style Example

Using NativeWind (primary approach):

```tsx
<View className="rounded-clay border-2 border-clay bg-clay-card p-md shadow-clay">
  <Text className="text-lg font-bold text-clay-text">{book.title}</Text>
</View>
```

Equivalent using `StyleSheet` (alternative when utilities are not enough):

```ts
import { ViewStyle } from "react-native";
import { colors, radius, borderWidth, clayShadow } from "@/theme/tokens";

const cardStyle: ViewStyle = {
  backgroundColor: colors.cardBg,
  borderRadius: radius.card,
  borderWidth: borderWidth.standard,
  borderColor: colors.border,
  shadowColor: clayShadow.default.color,
  shadowOffset: clayShadow.default.offset,
  shadowOpacity: 1,
  shadowRadius: clayShadow.default.blurRadius,
  elevation: 4,
  padding: 16,
};
```

### 12.4 Design Constraints

- Use clay shadows mainly on primary cards and interactive components.
- Avoid thick shadows on too many elements within one screen.
- Keep text contrast against backgrounds clear.
- Minimum touch target 48x48 dp.
- Use at most two dominant accent colors per screen.
- Error, warning, and success states must remain clear even with pastel colors.

### 12.5 Share Card Design

The share card follows the claymorphism visual style and is designed to look attractive when shared on social media.

Design principles:

- Primary aspect ratio 9:16 for Instagram Story.
- Primary text must be large and easy to read on mobile.
- Progress percentage or Finished status must be the main visual element.
- Book title and author must remain readable even when the title is long.
- Reado branding may be shown small and must not distract from main content.
- Private notes are not shown unless the user explicitly chooses the quote/reflection share feature in a later version.
- The share card must remain attractive without a book cover.

---

## 13. Empty, Error, and Loading States

### 13.1 Empty States

- If no books exist, show "No books yet" and a "Add your first book" CTA.
- If a status filter has no books, show a message matching the status, e.g. "No books currently being read".
- If a search returns no results, show "Book not found" and an option to reset the search.

### 13.2 Error States

- If title is empty, show "Book title is required".
- If total pages is invalid, show "Total pages must be greater than 0".
- If current page exceeds total pages, show "Current page cannot exceed total pages".
- If a save operation fails, show an error message and do not auto-close the form.
- If a delete operation fails, show an error message and keep the data displayed.

### 13.3 Loading States

- Because data is local, normal loading should be very brief.
- If data is still loading, show a simple skeleton or light loading indicator.
- Avoid excessive UI blocking for simple local operations.

---

## 14. Non-Functional Requirements

### 14.1 Performance

- A local list of 1,000 books must load in under 1 second on a mid-range Android device.
- Add, edit, delete, and update-progress operations must feel instant and ideally complete in under 300 ms.
- Scrolling the book list must remain smooth for large collections.

### 14.2 Offline-First

- All core features work without internet.
- No core feature depends on a server.
- The app does not require login to be used.

### 14.3 Usability

- Adding the first book can be done with minimal fields: title, total pages, and status.
- Updating progress can be done in at most 2–3 steps from the list or book detail.
- Primary buttons are easy to find.
- Navigation is easy for new users to understand.

### 14.4 Data Safety

- Saved data must not be lost when the app is closed and reopened.
- The system must save changes consistently.
- If a save operation fails, the user must receive an error message.
- Export/import backup is prioritized for after the MVP because the app is local-only.

### 14.5 Compatibility

- The app is optimized for Android mobile portrait mode.
- The minimum target Android SDK for the MVP is Android 8.0 / API level 26, unless broader compatibility is needed during implementation planning.

---

## 15. Acceptance Criteria

### 15.1 Book Management

- The user can add a book with valid data.
- The user cannot save a book without a title.
- The user cannot save a book with total pages less than or equal to 0.
- The user cannot save a book if current page exceeds total pages.
- The user can edit an existing book's data.
- The user can delete a book after confirming the dialog.

### 15.2 Reading Progress

- The user can update the last page read.
- Progress percentage is calculated accurately.
- If current page equals total pages, progress becomes 100%.
- If status changes to Finished, `finishedAt` is saved.
- If status changes to Reading, `startedAt` is saved if previously empty.

### 15.3 Library and Search

- The user can view the saved book list.
- The user can filter books by status.
- The user can search books by title or author.
- If a search returns no results, the system shows the empty result state.

### 15.4 Local Persistence

- Data remains available after the app is closed and reopened.
- Data changes are saved locally without an internet connection.

### 15.5 UI Consistency

- Primary components use claymorphism consistently.
- Primary buttons have comfortable touch targets.
- Error states are easy to read and understand.

### 15.6 Share Progress

- The user can open a progress share-card preview from the book detail.
- The progress share card shows the book data and progress correctly.
- The user can open a finished-book share-card preview for books with status Finished.
- The user can share a share card via the Android share sheet.
- The share card uses the 9:16 ratio suitable for Instagram Story.
- The share card does not show the private note automatically.

---

## 16. Success Metrics

For the MVP, product success is measured by task completion and the quality of the core experience.

- The user can add the first book in under 1 minute.
- The user can update reading progress in at most 2–3 steps.
- The user can create and share a share card in at most 3 steps from the book detail.
- The user can find a specific book in a list of 100 books via search or filter.
- All core features can be completed without an internet connection.
- No data loss under normal usage scenarios.
- Claymorphism UI is consistent across the library, form, detail, primary dialogs, and share card.

If the app is released publicly, advanced metrics may include:

- Day-7 retention.
- Average number of books added per user.
- Frequency of progress updates per week.
- Number of users who finish at least one book.
- Percentage of users who create a share card.
- Number of share cards created per week.
- Percentage of finished books that are shared.

---

## 17. Risks and Mitigations

### 17.1 Local Data Loss

Risk:

- Local data can be lost if the app is uninstalled or the user changes devices.

Mitigation:

- Add export/import backup in the phase after MVP.
- Inform users that MVP data is stored locally on the device.

### 17.2 Data Migration

Risk:

- Model changes after release can make old data hard to read.

Mitigation:

- Use schema versioning and migrations as supported by the chosen local database (WatermelonDB).
- Avoid incompatible model changes without a migration plan.

### 17.3 Manual Input Friction

Risk:

- Manual input can feel slow if the user wants to add many books.

Mitigation:

- Keep required fields minimal.
- Make additional fields such as genre, rating, and notes optional.
- Consider an ISBN scanner or metadata API as an advanced feature.

### 17.4 Visual Overload

Risk:

- Claymorphism can make the UI too busy if every element gets a thick border and shadow.

Mitigation:

- Use thick shadows only on primary components.
- Limit the number of accent colors per screen.
- Keep text contrast and visual hierarchy clear.

### 17.5 Database Choice

Risk:

- A poor local database choice can complicate advanced features.

Mitigation:

- Use WatermelonDB to support queries, filters, and advanced feature development.
- Build a repository/data-access layer so the database can be swapped with minimal impact.

### 17.6 Privacy When Sharing

Risk:

- The user may accidentally share a private note or information they did not intend to publish.

Mitigation:

- The MVP share card shows only basic book data and progress.
- Private notes are not included in the share card automatically.
- Quotes or reflections are shared only if the user explicitly chooses that feature in a later version.
- The system always shows a preview before opening the share sheet.

### 17.7 WatermelonDB Development Build

Risk:

- WatermelonDB ships a native module, so the app cannot run inside Expo Go. Developers expecting Expo Go will hit a runtime error.

Mitigation:

- Use `expo run:android` for local development or the EAS Build `development` profile.
- Document this requirement clearly in the README and onboarding.

---

## 18. Future Enhancements

Priorities after the MVP:

1. Export/import local backup.
2. Reading progress update history.
3. Simple statistics of finished books and pages read.
4. Share a quote or short reflection.
5. Multiple visual templates for share cards.
6. Custom caption for share cards.
7. Weekly or monthly reading targets.
8. Daily reading reminder.
9. Local book cover.
10. Custom theme.
11. Book tag system.
12. Custom collections or bookshelves.
13. ISBN barcode scan.
14. Fetch book metadata from external APIs.
15. Cloud sync.
16. Account login.
17. Android widget.
18. Separate reviews and quotes.

---

## 19. MVP Summary

The Reado MVP is an Expo + React Native Android app for personal reading tracking — local-first and easy to share. The MVP focus is the book library, book CRUD, page-progress updates, status filter, simple search, private notes, share progress card, share finished-book card, local storage, and basic claymorphism visuals.

Key MVP decisions:

- No login.
- No backend.
- Data is stored locally.
- The recommended local database is WatermelonDB (SQLite-backed, reactive, with schema migrations).
- MMKV is used for lightweight preferences (theme, simple settings).
- ReadingProgressLog is not required for MVP Core and belongs to MVP Plus.
- A full dashboard belongs to MVP Plus; MVP Core may use a small summary on the library screen.
- Share progress and share finished book are part of MVP Core as image share cards via the Android share sheet.
- In-app social features such as feed, follow, comments, likes, and public profiles are not part of the MVP.
- Manual input is kept simple with minimum required fields.
