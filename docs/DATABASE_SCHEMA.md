# SupplierHub Database Schema

## Model and collection

The backend registers a Mongoose model named `Supplier` in `server/models/Supplier.js`. Mongoose's default model-to-collection naming convention maps it to the `suppliers` collection. The database name is selected by the database name in `MONGODB_URI`; it is not hard-coded in the server.

## Fields

| Field | Type | Required | Default | Rules |
|---|---|---:|---|---|
| `companyName` | String | Yes | — | Trimmed. |
| `contactPerson` | String | Yes | — | Trimmed. |
| `email` | String | Yes | — | Trimmed, converted to lowercase, must match `^[^\s@]+@[^\s@]+\.[^\s@]+$`. |
| `phone` | String | Yes | — | Trimmed. |
| `category` | String | Yes | — | Trimmed. |
| `address` | String | No | `""` | Trimmed. |
| `paymentTerms` | String | No | `""` | Trimmed. |
| `status` | String | No | `"Active"` | Enum: `"Active"` or `"Inactive"`. |

The schema enables Mongoose timestamps, which add `createdAt` and `updatedAt` date fields. Mongoose also supplies `_id` and the default version key `__v`. No custom indexes, unique constraints, nested subdocuments or relationships are declared in the schema.

## Example document

The following is fictional documentation data:

```json
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
```

## Validation and persistence notes

- Missing required fields are rejected by Mongoose and returned through the Express error handler as `400 Bad Request`.
- Invalid email format is rejected by the schema's match validator.
- Values for `status` outside the two enum strings fail validation.
- `POST /api/suppliers` uses `Supplier.create`.
- `PUT /api/suppliers/:id` restricts updates to the eight business fields and enables `runValidators`.
- `DELETE /api/suppliers/:id` removes the document.
- No seed or migration script is defined in the server package.

Settings and notifications are not database fields. They are stored in the browser under the `supplierhub-settings` and `supplierhub-notifications` `localStorage` keys.
