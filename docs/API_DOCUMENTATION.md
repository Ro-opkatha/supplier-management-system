# SupplierHub API Documentation

## Base URL and conventions

The Express application mounts routes under `/api`. The default local API base URL is:

```text
http://localhost:5000/api
```

Requests with a JSON body should use `Content-Type: application/json`. The API does not currently require authentication. Supplier IDs are MongoDB ObjectIds.

## Health check

### `GET /api/health`

Returns a simple server health response. The server only begins listening after MongoDB connects.

**Example request**

```http
GET http://localhost:5000/api/health
```

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Supplier Management API is running"
}
```

## List suppliers

### `GET /api/suppliers`

Returns matching suppliers, sorted by `createdAt` descending.

**Query parameters**

| Name | Optional | Behavior |
|---|---:|---|
| `search` | Yes | Case-insensitive regular-expression match against `companyName` or `contactPerson`. Regex metacharacters in the search term are escaped. |
| `category` | Yes | Exact match against the supplier category. |
| `status` | Yes | Exact match against the supplier status (`Active` or `Inactive`). |

Parameters can be combined. There is no pagination.

**Example request**

```http
GET http://localhost:5000/api/suppliers?search=Northwind&category=Electronics&status=Active
```

**Success — `200 OK`**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64b000000000000000000001",
      "companyName": "Northwind Components",
      "contactPerson": "Jordan Example",
      "email": "jordan@example.test",
      "phone": "+1-555-0100",
      "category": "Electronics",
      "address": "100 Sample Street",
      "paymentTerms": "Net 30",
      "status": "Active",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z",
      "__v": 0
    }
  ]
}
```

`data` is an empty array and `count` is zero when no records match.

## Get supplier details

### `GET /api/suppliers/:id`

Returns the supplier whose MongoDB ID matches `:id`.

**Example request**

```http
GET http://localhost:5000/api/suppliers/64b000000000000000000001
```

**Success — `200 OK`**

```json
{
  "success": true,
  "data": {
    "_id": "64b000000000000000000001",
    "companyName": "Northwind Components",
    "contactPerson": "Jordan Example",
    "email": "jordan@example.test",
    "phone": "+1-555-0100",
    "category": "Electronics",
    "address": "100 Sample Street",
    "paymentTerms": "Net 30",
    "status": "Active",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z",
    "__v": 0
  }
}
```

## Create supplier

### `POST /api/suppliers`

Creates a supplier from the JSON body. `companyName`, `contactPerson`, `email`, `phone` and `category` are required. `address` and `paymentTerms` are optional and default to empty strings. `status` is optional and defaults to `Active`.

**Example request**

```http
POST http://localhost:5000/api/suppliers
Content-Type: application/json
```

```json
{
  "companyName": "Northwind Components",
  "contactPerson": "Jordan Example",
  "email": "jordan@example.test",
  "phone": "+1-555-0100",
  "category": "Electronics",
  "address": "100 Sample Street",
  "paymentTerms": "Net 30",
  "status": "Active"
}
```

**Success — `201 Created`**

```json
{
  "success": true,
  "message": "Supplier created successfully",
  "data": {
    "_id": "64b000000000000000000001",
    "companyName": "Northwind Components",
    "contactPerson": "Jordan Example",
    "email": "jordan@example.test",
    "phone": "+1-555-0100",
    "category": "Electronics",
    "address": "100 Sample Street",
    "paymentTerms": "Net 30",
    "status": "Active",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z",
    "__v": 0
  }
}
```

## Update supplier

### `PUT /api/suppliers/:id`

Updates the provided subset of allowed supplier fields. Omitted fields are left unchanged. Allowed fields are `companyName`, `contactPerson`, `email`, `phone`, `category`, `address`, `paymentTerms` and `status`; schema validators run on the update.

**Example request**

```http
PUT http://localhost:5000/api/suppliers/64b000000000000000000001
Content-Type: application/json
```

```json
{
  "contactPerson": "Taylor Example",
  "phone": "+1-555-0101"
}
```

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Supplier updated successfully",
  "data": {
    "_id": "64b000000000000000000001",
    "companyName": "Northwind Components",
    "contactPerson": "Taylor Example",
    "email": "jordan@example.test",
    "phone": "+1-555-0101",
    "category": "Electronics",
    "address": "100 Sample Street",
    "paymentTerms": "Net 30",
    "status": "Active",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-16T10:00:00.000Z",
    "__v": 0
  }
}
```

## Delete supplier

### `DELETE /api/suppliers/:id`

Deletes the matching supplier.

**Example request**

```http
DELETE http://localhost:5000/api/suppliers/64b000000000000000000001
```

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Supplier deleted successfully"
}
```

## Dashboard statistics

### `GET /api/dashboard/stats`

Counts all supplier documents and documents with each supported status.

**Example request**

```http
GET http://localhost:5000/api/dashboard/stats
```

**Success — `200 OK`**

```json
{
  "success": true,
  "data": {
    "total": 12,
    "active": 9,
    "inactive": 3
  }
}
```

The numeric values above are illustrative only.

## Error responses

The common JSON error shape is:

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status | When returned | Example message |
|---:|---|---|
| `400 Bad Request` | Mongoose validation failure | `Company name is required` |
| `400 Bad Request` | Invalid supplier ObjectId on detail/update/delete | `Invalid supplier ID` |
| `400 Bad Request` | Mongoose cast failure | `Invalid ID or value` |
| `404 Not Found` | A syntactically valid supplier ID has no matching document | `Supplier not found` |
| `409 Conflict` | MongoDB reports duplicate key error code `11000` | `A record with this unique value already exists` |
| `500 Internal Server Error` | Other unhandled server/database errors | `Internal server error` |

The current Supplier schema does not declare a unique field or index; the `409` response is handled generically by the error middleware and is not expected from the declared schema alone.

## Routes not exposed as APIs

Settings and notification operations use browser `localStorage`; there are no corresponding API routes. The application does not currently expose authentication, pagination, or user-management endpoints.
