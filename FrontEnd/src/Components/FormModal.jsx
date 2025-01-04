import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FormModal = ({
  isVisible,
  onClose,
  selectedItem,
  preferredTime,
  setPreferredTime,
}) => {
  const [name, setName] = useState("");
  const [telephone, setPhone] = useState("");
  const [postCode, setPostCode] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(""); // For extra fields, especially for courses

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !telephone || !postCode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://three60drivingschool.onrender.com/booking",
        {
          transmissionType: selectedItem?.transmission || "N/A",
          name: name,
          telephone: telephone,
          postCode: postCode,
          timetocontact: preferredTime,
          packagename: selectedItem?.name,
        }
      );

      toast.success("Booking successful!");
      setName("");
      setPhone("");
      setPostCode("");
      setAdditionalInfo("");
      onClose();
    } catch (error) {
      toast.error("Error booking.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          ×
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">
          {selectedItem?.type === "course"
            ? `Enroll in ${selectedItem?.name}`
            : "Confirm Your Booking"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="text-lg font-semibold">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Telephone Field */}
          <div className="mb-4">
            <label className="text-lg font-semibold">Telephone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Postcode Field */}
          <div className="mb-4">
            <label className="text-lg font-semibold">Postcode</label>
            <input
              type="text"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Preferred Time */}
          <div className="mb-4">
            <label className="text-lg font-semibold">
              Preferred Time to Contact
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          {/* Course-Specific Additional Info */}

          {/* Selected Item Display */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Selected: {selectedItem?.name || "No item selected"}
            </h3>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-md"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
