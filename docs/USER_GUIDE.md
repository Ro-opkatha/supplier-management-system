# SupplierHub User Guide

## 1. Access the application

Start MongoDB, the backend and the frontend. Follow the setup instructions in the [README](../README.md); the backend and frontend run in separate terminals. Open the Vite URL printed in the client terminal (normally `http://localhost:5173`).

No sign-in is implemented. Anyone who can reach the application can use the available supplier functions.

## 2. Understand the Dashboard

The Dashboard shows:

- Total suppliers.
- Active suppliers.
- Inactive suppliers.
- Up to five recent supplier records.

The counts come from `GET /api/dashboard/stats`. The recent list comes from the supplier list response. Use **View all** or the sidebar's **Suppliers** item to open the full directory.

## 3. View suppliers

Choose **Suppliers** in the sidebar. The directory displays supplier company/contact details, category, status and row actions. The table shows all records returned by the API; pagination is not currently implemented.

## 4. Search suppliers

Enter a company name or contact person's name in the search field. The page waits briefly after typing and requests matching results from the API. Search is case-insensitive and checks those two fields only.

Clear the search text to show results without a search term.

## 5. Filter suppliers

- Choose a category from **All categories** to filter to that exact category.
- Choose **Active** or **Inactive** from **All statuses** to filter by status.
- Return either selector to its “All” option to remove that filter.

Search and filters can be combined.

## 6. Add a supplier

Use **Add Supplier** from the Dashboard or Suppliers page. Complete the required fields:

- Company name
- Contact person
- Email address
- Phone number
- Category

Address and payment terms are optional. Status starts with the default selected in Settings, but can be changed for this supplier before saving. The form checks required values and email format; the server also validates the model.

Choose **Add supplier** to submit or **Cancel** to close without saving. A successful creation shows a confirmation and adds a notification. Failed requests show an error and do not create a success notification.

## 7. Edit supplier information

In the supplier row, choose the pencil/edit action. Change the fields and choose **Save changes**. The update request sends the edited fields to the API; on success, the row is refreshed and an update notification is added.

## 8. Delete a supplier

Choose the trash/delete action in the supplier row and confirm the browser prompt. Confirming deletes the record through the API and adds a deletion notification. Cancelling the browser prompt leaves the record unchanged and creates no notification.

## 9. Use notifications

Select the bell in the top navigation to open the notification centre. Successful supplier creation, editing and deletion are shown with a message and localized timestamp.

- The bell badge shows the unread count; counts above 99 are displayed as `99+`.
- Choose **Mark as read** on an item to read only that notification.
- Choose **Mark all as read** to clear the unread count.
- Choose **Clear all** to remove the notification history.
- The panel closes when you click outside it, press Escape, or navigate to another page.
- If there are no notifications, the panel shows an empty state.

Up to 100 notifications are retained, newest first. Notifications and read state are stored in the current browser's `localStorage`; clearing browser storage removes them.

## 10. Manage application settings

Open **Settings** from the sidebar:

- **Application name:** changes the branding shown in the sidebar and top navigation.
- **Application description:** editable workspace description.
- **Default supplier status:** sets the initial status for new supplier forms.
- **Save settings:** writes preferences to this browser's `localStorage` and displays a success or error message.
- **Reset to Default:** immediately saves the default application name, description, `Active` supplier status and light theme.

The About section displays the fixed SupplierHub identity and the technologies used; it is informational and is not edited by the application name setting.

## 11. Switch themes

Select **Light** or **Dark** under Display Preferences. The interface updates immediately. Choose **Save settings** to retain the selected theme after a refresh. Unsaved changes are held only in the current page state.

## 12. Reset preferences

Choose **Reset to Default** on the Settings page. The reset is applied and saved immediately:

- Application name: `SupplierHub`
- Application description: `Manage your supplier relationships with SupplierHub.`
- Default supplier status: `Active`
- Theme: `Light`

Resetting Settings does not clear notifications. Use **Clear all** in the notification centre to remove those separately.

## Browser storage

Settings and notifications are local to the current browser profile. They are not shared across browsers or devices and are not written to MongoDB.
