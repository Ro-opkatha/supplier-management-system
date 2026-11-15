# SupplierHub Project Overview

## Project background

SupplierHub is a MERN application for maintaining supplier records and viewing basic supplier status statistics. It uses a React/Vite client, an Express API, Mongoose models, and a MongoDB database. The application currently operates as a single workspace without user accounts.

## Problem statement

Supplier data can become difficult to maintain when company and contact details are kept in disconnected records. Users need a consistent place to search for suppliers, update contact information, remove obsolete records and understand the current mix of active and inactive suppliers.

## Objectives

- Provide a supplier directory backed by MongoDB.
- Support creating, viewing, updating and deleting supplier records.
- Make suppliers searchable by company or contact person and filterable by category and status.
- Present total, active and inactive supplier counts on the dashboard.
- Provide browser-local settings and notifications for supplier operations.

## Scope

The implemented scope is the React single-page interface, the `/api` Express service, and the `Supplier` Mongoose model. Page navigation is managed by React state; no client-side router is configured. The API provides health, supplier and dashboard-statistics endpoints.

Settings and notification history are stored in the current browser's `localStorage`. They are not associated with a user account and are not synchronized with the database.

## Functional requirements

| Requirement | Implemented behavior |
|---|---|
| View dashboard statistics | API returns total, active and inactive counts. The dashboard also displays up to five recent suppliers from the fetched list. |
| Browse suppliers | Supplier page requests the supplier list and displays company and contact data. |
| Search | The page sends a search query; the API matches company name or contact person without case sensitivity. |
| Filter | Category and status query parameters are supported. |
| Create supplier | Required fields are validated in the client and the API creates a Mongoose document. |
| Edit supplier | Client submits allowed fields to the supplier update route. |
| Delete supplier | Client asks for confirmation before issuing the delete request. |
| Notify on successful operations | Client records add, update and delete notifications only after the corresponding API request resolves successfully. |
| Manage preferences | Application name, application description, default new-supplier status and theme are editable and stored locally. |
| Read and clear notifications | Notifications can be marked individually or all at once, and can be cleared. Notification and read state persist locally. |

## Non-functional requirements

- **Maintainability:** client and server are separated into their own package directories, each with a lockfile.
- **Usability:** responsive interface, validation feedback, operation confirmation and loading/error states are implemented in the client.
- **Data integrity:** Mongoose requires the company and contact fields, validates email format and restricts status to `Active` or `Inactive`.
- **Configuration:** backend connection, port and CORS origin use environment variables. The client API base can be overridden with `VITE_API_URL`.
- **Privacy of local configuration:** root ignore rules exclude local `.env` files; the server `.env.example` is retained as a template.

## Implemented features

- Dashboard with total, active and inactive statistics and a recent-suppliers table.
- Supplier directory with search and category/status filters.
- Add, edit and delete supplier workflows.
- Notification centre with timestamps, unread count, individual and bulk read actions, clear-all and an empty state.
- Settings for application identity/description, default supplier status, and light/dark themes.
- Browser `localStorage` persistence for preferences and up to 100 notifications.
- Health endpoint and JSON error handling for common Mongoose validation and ID errors.

## Current limitations

- No authentication, authorization, roles or user-specific data isolation.
- No server-side pagination or total-page metadata; list queries return all matching documents.
- No server-side persistence for settings or notifications.
- No automated test command is defined in either package manifest.
- No seed script, migration framework, backup procedure, CI pipeline, container setup or deployment configuration was found.
- Search is limited to `companyName` and `contactPerson`; filters are exact equality matches.
- No contribution guide or repository-level license file is present.

## Potential future enhancements

- Add automated tests for model validation, API behavior, UI flows and browser persistence.
- Add authentication/authorization before supporting multiple users or organizations.
- Introduce pagination and indexed search if directory size requires it.
- Add API request schemas and a documented error contract.
- Provide deployment, monitoring, backup and recovery procedures appropriate to the target environment.
- Consider server-side user preferences and notification storage only if cross-device synchronization is required.
