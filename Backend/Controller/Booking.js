import mongoose from "mongoose";
import Booking from "../Model/Booking.js";

/* Validation helpers */
const isValidEmail = (email) =>
  typeof email === "string" && /^\S+@\S+\.\S+$/.test(email);

const isValidPhone = (phone) =>
  typeof phone === "string" && /^[0-9+\-\s()]{6,30}$/.test(phone);

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Create booking
 * Accepts either:
 *  - { name, telephone, postCode, timetocontact, transmissionType, packagename, honeypot }
 *  - or { fullName, phone, location, contactMethod, bookingMode, packageName, honeypot }
 */
export const createBooking = async (req, res) => {
  try {
    const {
      // older names
      name,
      telephone,
      postCode,
      timetocontact,
      transmissionType,
      packagename,
      // newer names
      fullName,
      phone,
      location,
      contactMethod,
      bookingMode,
      packageName,
      // common
      email,
      honeypot,
      metadata = {},
    } = req.body;

    // Honeypot spam check
    if (honeypot) {
      return res.status(400).json({ error: "Bot suspected" });
    }

    const resolvedName = (fullName || name || "").trim();
    const resolvedPhone = (phone || telephone || "").trim();
    const resolvedLocation = (location || postCode || "").trim();
    const resolvedContactMethod = (contactMethod || timetocontact || "phone").trim();
    const resolvedBookingMode = (bookingMode || transmissionType || "manual").trim();
    const resolvedPackageName = (packageName || packagename || "General Enq").trim();
    const resolvedEmail = email ? String(email).trim().toLowerCase() : "";

    // Basic validations
    if (!resolvedName) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!resolvedLocation) {
      return res.status(400).json({ error: "Location / postCode is required" });
    }
    if (resolvedContactMethod === "email" && !isValidEmail(resolvedEmail)) {
      return res.status(400).json({ error: "Valid email required when contact method is email" });
    }
    if (resolvedContactMethod === "phone" && !isValidPhone(resolvedPhone)) {
      return res.status(400).json({ error: "Valid phone required when contact method is phone" });
    }

    const bookingData = {
      // preserve original fields (for compatibility with your existing model)
      name: resolvedName,
      telephone: resolvedPhone,
      postCode: resolvedLocation,
      timetocontact: resolvedContactMethod,
      transmissionType: resolvedBookingMode,
      packagename: resolvedPackageName,
      // useful additional fields (if your model has them they will be saved)
      fullName: resolvedName,
      phone: resolvedPhone,
      location: resolvedLocation,
      contactMethod: resolvedContactMethod,
      bookingMode: resolvedBookingMode,
      packageName: resolvedPackageName,
      email: resolvedEmail,
      status: "new",
      metadata: {
        ...metadata,
        ip: req.ip || req.connection?.remoteAddress || "",
        userAgent: req.get("User-Agent") || "",
      },
    };

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    return res.status(201).json(newBooking);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("createBooking error:", error);
    return res.status(500).json({ error: error.message || "Failed to create booking" });
  }
};

/**
 * GET /api/bookings
 * Query params:
 *  - page (default 1)
 *  - limit (default 50)
 *  - q (search)
 *  - status (optional)
 */
export const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 50, q, status, sortBy = "createdAt", order = "desc" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));

    const query = {};
    if (status) query.status = status;

    if (q) {
      const escaped = String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      query.$or = [
        { name: regex },
        { fullName: regex },
        { email: regex },
        { phone: regex },
        { telephone: regex },
        { packagename: regex },
        { packageName: regex },
        { postCode: regex },
        { location: regex },
      ];
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const [items, total] = await Promise.all([
      Booking.find(query).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum).lean().exec(),
      Booking.countDocuments(query),
    ]);

    return res.status(200).json({
      data: items,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getBookings error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch bookings" });
  }
};

/**
 * GET /api/bookings/:id
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid booking id" });

    const booking = await Booking.findById(id).exec();
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    return res.status(200).json(booking);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getBookingById error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch booking" });
  }
};

/**
 * PATCH /api/bookings/:id
 * Whitelisted updates only
 */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid booking id" });

    const allowed = [
      "name",
      "fullName",
      "telephone",
      "phone",
      "postCode",
      "location",
      "timetocontact",
      "contactMethod",
      "transmissionType",
      "bookingMode",
      "packagename",
      "packageName",
      "email",
      "status",
      "metadata",
    ];

    const updates = {};
    for (const key of allowed) {
      if (typeof req.body[key] !== "undefined") updates[key] = req.body[key];
    }

    // Validate contact-method-specific updates if provided
    if (updates.contactMethod === "email" && updates.email && !isValidEmail(updates.email)) {
      return res.status(400).json({ error: "Valid email required for contactMethod=email" });
    }
    if (updates.contactMethod === "phone" && updates.phone && !isValidPhone(updates.phone)) {
      return res.status(400).json({ error: "Valid phone required for contactMethod=phone" });
    }

    const updated = await Booking.findByIdAndUpdate(id, updates, { new: true }).exec();
    if (!updated) return res.status(404).json({ error: "Booking not found" });

    return res.status(200).json(updated);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("updateBooking error:", error);
    return res.status(500).json({ error: error.message || "Failed to update booking" });
  }
};

/**
 * DELETE /api/bookings/:id
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid booking id" });

    const deleted = await Booking.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Booking not found" });

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("deleteBooking error:", error);
    return res.status(500).json({ error: error.message || "Failed to delete booking" });
  }
};