import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const BookingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  // Sample booking data

  // Function to handle view booking

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleDeleteBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteConfirm(true); //
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false); // Close the confirmation modal
    setSelectedBooking(null); // Reset the selected booking
  };
  const deleteBooking = async (id) => {
    try {
      await axios.delete(
        `https://three60drivingschool.onrender.com/booking/${id}`
      );
      setShowDeleteConfirm(false);
      // setBookings(bookings.filter((booking) => booking.id !== id));
      toast.success("Booking deleted successfully!", {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // Fetch bookings on component mount
  useEffect(() => {
    axios
      .get("https://three60drivingschool.onrender.com/booking")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, [bookings]);
  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">My Bookings</h1>
      </header>

      <div className="flex flex-wrap gap-8">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="w-full sm:w-80 bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-700">Name :{booking.name}</p>
              <p className="text-sm text-gray-700">
                Phone number: {booking.telephone}
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

      {/* Booking Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-8 rounded-lg w-96">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-2xl text-gray-500"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Booking Details
            </h2>
            {selectedBooking && (
              <div className="space-y-4">
                <p>
                  <strong>Booking ID:</strong> {selectedBooking._id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedBooking.createdAt.split("T")[0]}
                </p>

                <p>
                  <strong>Phone Number:</strong> {selectedBooking.telephone}
                </p>
                <p>
                  <strong>Post Code:</strong> {selectedBooking.postCode}
                </p>
                <p>
                  <strong>Preferred Time to Contact: </strong>
                  {selectedBooking.timetocontact}
                </p>
                <p>
                  <strong>Package Selected:</strong>{" "}
                  {selectedBooking.packagename}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="mb-6 text-gray-600">
              You are about to delete booking #{selectedBooking._id}. This
              action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => deleteBooking(selectedBooking._id)}
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
