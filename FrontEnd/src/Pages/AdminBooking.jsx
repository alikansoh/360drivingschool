import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Safe environment accessor for browser builds
 * - Supports CRA (process.env.REACT_APP_*)
 * - Supports Vite (import.meta.env.VITE_*)
 * - Falls back to provided default
 */
function getClientEnv(key, fallback = "") {
  try {
    if (typeof process !== "undefined" && process?.env && process.env[key]) {
      return process.env[key];
    }
    if (typeof import.meta !== "undefined" && import.meta?.env) {
      if (import.meta.env[key]) return import.meta.env[key];
      if (key.startsWith("REACT_APP_")) {
        const viteKey = "VITE_" + key.slice("REACT_APP_".length);
        if (import.meta.env[viteKey]) return import.meta.env[viteKey];
      }
      const alt = key.replace(/^REACT_APP_/, "VITE_");
      if (import.meta.env[alt]) return import.meta.env[alt];
    }
  } catch (err) {
    // swallow and return fallback
  }
  return fallback;
}

const BookingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use safe env accessor for API base URL
  const apiBase = getClientEnv("REACT_APP_API_BASE_URL", "https://three60drivingschool.onrender.com");
  // Use the /booking path (matching your server route)
  const bookingsUrl = `${apiBase.replace(/\/$/, "")}/booking`;

  // Fetch bookings on component mount (only once)
  useEffect(() => {
    let cancelled = false;
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(bookingsUrl, {
          params: { page: 1, limit: 200 },
        });

        const result =
          res?.data?.data && Array.isArray(res.data.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];

        if (!cancelled) setBookings(result);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBookings();
    return () => {
      cancelled = true;
    };
  }, [bookingsUrl]); // only re-run if bookingsUrl changes (i.e. different env)

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleDeleteBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedBooking(null);
  };

  const deleteBooking = async (id) => {
    if (!id) return;
    try {
      await axios.delete(`${bookingsUrl}/${id}`);
      // remove from UI immediately
      setBookings((prev) => prev.filter((b) => b._id !== id && b.id !== id));
      setShowDeleteConfirm(false);
      setSelectedBooking(null);
      toast.success("Booking deleted successfully!", {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">My Bookings</h1>
      </header>

      {loading ? (
        <div className="text-center py-8">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No bookings found.</div>
      ) : (
        <div className="flex flex-wrap gap-8">
          {bookings.map((booking) => (
            <div
              key={booking._id || booking.id}
              className="w-full sm:w-80 bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  Name: {booking.fullName || booking.name || "—"}
                </p>
                <p className="text-sm text-gray-700">
                  Phone: {booking.phone || booking.telephone || "—"}
                </p>
                <p className="text-sm text-gray-700">
                  Package: {booking.packageName || booking.packagename || "—"}
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => handleViewBooking(booking)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteBooking(booking)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-8 rounded-lg w-full max-w-md">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-2xl text-gray-500"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Booking Details
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Booking ID:</strong> {selectedBooking._id || selectedBooking.id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedBooking.createdAt
                  ? String(selectedBooking.createdAt).split("T")[0]
                  : "—"}
              </p>
              <p>
                <strong>Name:</strong> {selectedBooking.fullName || selectedBooking.name || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedBooking.phone || selectedBooking.telephone || "—"}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.email || "—"}
              </p>
              <p>
                <strong>Post Code / Location:</strong>{" "}
                {selectedBooking.location || selectedBooking.postCode || "—"}
              </p>
            
              <p>
                <strong>Booking Mode / Transmission:</strong>{" "}
                {selectedBooking.bookingMode ||
                  selectedBooking.transmissionType ||
                  "—"}
              </p>
              <p>
                <strong>Package Selected:</strong>{" "}
                {selectedBooking.packageName || selectedBooking.packagename || "—"}
              </p>
              {selectedBooking.metadata && selectedBooking.metadata.additionalInfo && (
                <p>
                  <strong>Additional info:</strong>{" "}
                  {selectedBooking.metadata.additionalInfo}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Are you sure?</h2>
            <p className="mb-6 text-gray-600">
              You are about to delete booking{" "}
              <span className="font-mono">{selectedBooking._id || selectedBooking.id}</span>.
              This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => deleteBooking(selectedBooking._id || selectedBooking.id)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;