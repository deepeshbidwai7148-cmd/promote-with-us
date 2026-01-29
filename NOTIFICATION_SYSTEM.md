# Notification System Implementation

## Overview
A real-time notification system has been implemented to alert the admin panel whenever users change their profile data or submit description update requests.

## Components Added

### 1. Backend (server.js)

#### New Data Storage
- **notifications.json**: Stores all notifications in JSON format

#### New Functions
- `loadNotifications()`: Loads notifications from file
- `saveNotifications()`: Saves notifications to file
- `addNotification()`: Creates new notifications for profile updates or description changes

#### Updated Endpoints
- `PUT /api/lead/:id` (Profile Update)
  - Now tracks changes and creates a "profile_update" notification
  - Captures what fields were modified (brand name, phone, email, plan, etc.)

- `POST /api/lead/:id/description-update-request` (Description Update)
  - Now creates a "description_update" notification
  - Includes the update request details

#### New API Endpoints
- `GET /api/notifications` - Fetch all notifications with unread count
- `PATCH /api/notifications/:id/read` - Mark single notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification

### 2. Frontend (admin-login.html)

#### New UI Elements
- **Notifications Tab**: New tab in admin dashboard to view all notifications
- **Notification Badge**: Red badge showing unread notification count on the tab button
- **Notification Card**: Each notification displays:
  - Notification type (Profile Update / Description Update)
  - User's company name
  - User's email
  - Timestamp
  - Details of changes
  - Action buttons (Mark as Read, Delete)

#### New CSS Styles
- `.notification-item`: Main notification container
- `.notification-item.unread`: Styling for unread notifications
- `.notification-header`: Header section with type badge and company info
- `.notification-type`: Type badge styling
- `.notification-details`: Details text styling
- `.notification-actions`: Action buttons styling
- `.no-notifications`: Empty state message

#### New JavaScript Functions
- `loadNotifications()`: Fetches and displays notifications from API
- `markNotificationAsRead()`: Marks a single notification as read
- `markAllNotificationsAsRead()`: Marks all notifications as read
- `deleteNotification()`: Deletes a notification

#### Updated Functions
- `showDashboard()`: Now calls `loadNotifications()` on login
- `switchTab()`: Reloads notifications when switching to notifications tab

## Features

### Notification Types

#### Profile Update
Triggered when any of the following user profile fields are changed:
- Brand/Company Name
- Phone Number
- Email Address
- Selected Plan
- Requirements
- Description
- Profile Photo
- Plan Start Date
- Plan End Date

Each change is logged separately in the notification details.

#### Description Update Request
Triggered when a user submits a request to update their service description:
- Shows the current description
- Shows the requested changes
- Tracks the request ID and timestamp

### Notification Status
- **Unread**: New notifications appear with a yellow left border and highlighted background
- **Read**: Notifications can be marked as read, changing their appearance
- **Badge Counter**: Unread count displayed on the notifications tab button

### Notification Management
- **Mark as Read**: Click to mark individual notifications as read
- **Mark All as Read**: Bulk action to mark all notifications as read
- **Delete**: Remove notifications from the dashboard
- **Auto-refresh**: Notifications reload when switching to the tab

## Notification Flow

### Profile Update Flow
1. User updates their profile in user-dashboard.html
2. Frontend sends PUT request to `/api/lead/:id`
3. Backend updates the lead data
4. Backend detects which fields changed
5. Backend calls `addNotification('profile_update', ...)`
6. Notification is saved to notifications.json
7. Admin can see the notification in the Notifications tab

### Description Update Flow
1. User submits description update request in user-dashboard.html
2. Frontend sends POST request to `/api/lead/:id/description-update-request`
3. Backend creates the description update request
4. Backend calls `addNotification('description_update', ...)`
5. Notification is saved to notifications.json
6. Admin receives both in-app notification and email alert

## Data Structure

### Notification Object
```json
{
  "id": 1234567890,
  "type": "profile_update" or "description_update",
  "leadId": 1,
  "brandName": "Company Name",
  "email": "user@example.com",
  "details": {
    "changes": ["Field: Old → New", ...],
    "timestamp": "2024-01-28T10:30:00.000Z"
  },
  "read": false,
  "createdAt": "2024-01-28T10:30:00.000Z"
}
```

## File Changes

### server.js
- Added notifications.json initialization
- Added `loadNotifications()`, `saveNotifications()`, `addNotification()` functions
- Modified `PUT /api/lead/:id` to track changes and create notifications
- Modified `POST /api/lead/:id/description-update-request` to create notifications
- Added 4 new API endpoints for notification management

### admin-login.html
- Added Notifications tab button with badge counter
- Added Notifications tab content section
- Added CSS styles for notification display
- Added 4 new JavaScript functions for notification management
- Updated `showDashboard()` to load notifications
- Updated `switchTab()` to reload notifications when tab is selected

## Testing

To verify the notification system:

1. **Login to Admin Panel**: Access the admin dashboard
2. **Switch to Notifications Tab**: Click the "🔔 Notifications" tab
3. **Test Profile Update**: Edit a user's profile data from the approved users section
4. **Check Notification**: A new profile update notification should appear
5. **Test Description Update**: Submit a description update request from user dashboard
6. **Check Notification**: A new description update notification should appear
7. **Mark as Read**: Click "Mark as Read" to change notification status
8. **Delete Notification**: Click "Delete" to remove notifications

## Future Enhancements

- [ ] Email notifications to admin for profile updates (currently only for description updates)
- [ ] Real-time notifications using WebSockets
- [ ] Notification categories/filtering
- [ ] Notification export/history
- [ ] SMS notifications for urgent updates
- [ ] Notification preferences/settings
