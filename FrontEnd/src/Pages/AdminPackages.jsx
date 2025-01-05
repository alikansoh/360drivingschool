import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    description: "",
    offer: "",
  });

  const [editPackage, setEditPackage] = useState({
    name: "",
    price: "",
    description: "",
    offer: "",
  });

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          "https://three60drivingschool.onrender.com/package"
        );
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  // Add Package
  const handleAddPackage = async () => {
    try {
      const response = await axios.post(
        "https://three60drivingschool.onrender.com/package",
        newPackage
      );
      setPackages([...packages, response.data]);
      setShowAddModal(false);
      toast.success("Package added successfully!");
      setNewPackage({ name: "", price: "", description: "", offer: "" });
    } catch (error) {
      console.error("Error adding package:", error);
      toast.error("Failed to add package. Please try again.");
    }
  };

  // Edit Package
  const handleEditPackage = async () => {
    try {
      const response = await axios.put(
        `https://three60drivingschool.onrender.com/package/${selectedPackage._id}`,
        editPackage
      );
      const updatedPackages = packages.map((pkg) =>
        pkg._id === selectedPackage._id ? response.data : pkg
      );
      setPackages(updatedPackages);
      setShowEditModal(false);
      setSelectedPackage(null);
      toast.success("Package updated successfully!");
    } catch (error) {
      console.error("Error editing package:", error);
      toast.error("Failed to update package. Please try again.");
    }
  };

  // Delete Package
  const handleDeletePackage = async () => {
    try {
      await axios.delete(
        `https://three60drivingschool.onrender.com/package/${selectedPackage._id}`
      );

      setPackages(packages.filter((pkg) => pkg._id !== selectedPackage._id));
      setShowDeleteConfirm(false);
      setSelectedPackage(null);
      toast.success("Package deleted successfully!");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Manage Packages
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add New Package
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-700">{pkg.name}</h3>
            <p className="text-sm text-gray-500">{pkg.description}</p>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              £{pkg.price}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  setSelectedPackage(pkg);
                  setEditPackage(pkg);
                  setShowEditModal(true);
                }}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedPackage(pkg);
                  setShowDeleteConfirm(true);
                }}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add New Package
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Package Name"
                value={newPackage.name}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, name: e.target.value })
                }
                required
              />
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <span className="mr-2 text-gray-600">£</span>
                <input
                  type="text"
                  className="flex-1 focus:outline-none"
                  placeholder="Package Price"
                  value={newPackage.price}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <input
                  type="text"
                  className="flex-1 focus:outline-none"
                  placeholder="Package Offer (optional)"
                  value={newPackage.offer}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, offer: e.target.value })
                  }
                />
                <span className="ml-2 text-gray-600">%</span>
              </div>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Package Description"
                value={newPackage.description}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, description: e.target.value })
                }
                required
              />
              <div className="flex justify-between">
                <button
                  onClick={handleAddPackage}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Add Package
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit Package
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Package Name"
                value={editPackage.name}
                onChange={(e) =>
                  setEditPackage({ ...editPackage, name: e.target.value })
                }
                required
              />
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <span className="mr-2 text-gray-600">£</span>
                <input
                  type="text"
                  className="flex-1 focus:outline-none"
                  placeholder="Package Price"
                  value={editPackage.price}
                  onChange={(e) =>
                    setEditPackage({ ...editPackage, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <input
                  type="text"
                  className="flex-1 focus:outline-none"
                  placeholder="Package Offer (optional)"
                  value={editPackage.offer}
                  onChange={(e) =>
                    setEditPackage({ ...editPackage, offer: e.target.value })
                  }
                />
                <span className="ml-2 text-gray-600">%</span>
              </div>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Package Description"
                value={editPackage.description}
                onChange={(e) =>
                  setEditPackage({
                    ...editPackage,
                    description: e.target.value,
                  })
                }
                required
              />
              <div className="flex justify-between">
                <button
                  onClick={handleEditPackage}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this package?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleDeletePackage}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
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

export default PackagesPage;
