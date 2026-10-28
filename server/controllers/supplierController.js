const mongoose = require("mongoose");
const Supplier = require("../models/Supplier");

// GET /api/suppliers
exports.getSuppliers = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { companyName: { $regex: safeSearch, $options: "i" } },
        { contactPerson: { $regex: safeSearch, $options: "i" } }
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    const suppliers = await Supplier.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/suppliers/:id
exports.getSupplierById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID"
      });
    }

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

// POST /api/suppliers
exports.createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/suppliers/:id
exports.updateSupplier = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID"
      });
    }

    const allowedFields = [
      "companyName", "contactPerson", "email", "phone",
      "category", "address", "paymentTerms", "status"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/suppliers/:id
exports.deleteSupplier = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID"
      });
    }

    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [total, active, inactive] = await Promise.all([
      Supplier.countDocuments(),
      Supplier.countDocuments({ status: "Active" }),
      Supplier.countDocuments({ status: "Inactive" })
    ]);

    res.status(200).json({
      success: true,
      data: { total, active, inactive }
    });
  } catch (error) {
    next(error);
  }
};