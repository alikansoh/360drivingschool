import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const FormModal = ({
  isVisible,
  onClose,
  transmissionType,
  selectedPackage,
  preferredTime,
  setPreferredTime,
  setSelectedPackage,
}) => {
  const [name, setName] = useState("");
  const [telephone, setPhone] = useState("");
  const [postCode, setPostCode] = useState("");
  if (!isVisible) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/booking", {
        transmissionType: transmissionType,
        name: name,
        telephone: telephone,
        postCode: postCode,
        timetocontact: preferredTime,
        packagename: selectedPackage,
      })
      console.log("Booking successful:", response.data);
      toast.success("Booking successful we will get back to you shortly!", {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
      // Clear form fields
      setName("");
      setPhone("");
      setPostCode("");
      onClose();
     
    
    } catch (error) {
      console.error("Error booking:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl"
        >
          &times;
        </button>

        {/* Form Header */}
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Book Your {transmissionType} Lessons
        </h2>

        {/* Form */}
        <form>
          {/* Full Name */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full  rounded-md p-3 border focus:border-red-600"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-gselectedPackageray-700 font-medium mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full  rounded-md p-3 border focus:border-red-600"
              placeholder="Enter your phone number"
              required
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Post Code */}
          <div className="mb-6">
            <label
              htmlFor="post-code"
              className="block text-gray-700 font-medium mb-2"
            >
              Post Code
            </label>
            <input
              type="text"
              id="post-code"
              className="w-full  rounded-md p-3 border focus:border-red-600"
              placeholder="Enter your Post Code"
              onChange={(e) => setPostCode(e.target.value)}
              required
            />
          </div>

          {/* Preferred Time */}
          <div className="mb-6">
            <label
              htmlFor="preferred-time"
              className="block text-gray-700 font-medium mb-2"
            >
              Preferred Time to contact you
            </label>
            <select
              id="preferred-time"
              className="w-full  border rounded-md bg-white p-3 focus:border-red-600"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            >
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
              <option value="evening">Evening (5 PM - 8 PM)</option>
            </select>
          </div>

          {/* Package Selected */}
          <div className="mb-6">
            <label
              htmlFor="package-selected"
              className="block text-gray-700 font-medium mb-2"
            >
              Package Selected
            </label>
            <select
              id="package-selected"
              value={selectedPackage}
              className="w-full  rounded-md p-3 bg-white border focus:border-red-600"
              readOnly
              onChange={(e) => setSelectedPackage(e.target.value)}
            >
              <option value={selectedPackage}>{selectedPackage}</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full  text-white bg-red-600 font-bold py-3 rounded-md hover:bg-red-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
