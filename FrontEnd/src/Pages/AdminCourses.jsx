import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://three60drivingschool.onrender.com/course";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    name: "",
    price: "",
    description: "",
    offer: "",
    image: null,
  });

  const [editCourse, setEditCourse] = useState({
    name: "",
    price: "",
    description: "",
    offer: "",
    image: null,
  });

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Handle file upload
  const handleImageUpload = (e, isEdit) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      if (isEdit) {
        setEditCourse({ ...editCourse, image: file }); // Update image for edit
      } else {
        setNewCourse({ ...newCourse, image: file }); // Update image for new course
      }
    }
  };

  // Handle Add Course
  const handleAddCourse = async () => {
    // Validation: Ensure all fields are filled
    if (
      !newCourse.name ||
      !newCourse.price ||
      !newCourse.description ||
      !newCourse.image
    ) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCourse.name);
    formData.append("price", newCourse.price);
    formData.append("description", newCourse.description);
    formData.append("offer", newCourse.offer);
    formData.append("image", newCourse.image);

    try {
      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCourses([...courses, response.data]);
      setShowAddModal(false);
      setNewCourse({
        name: "",
        price: "",
        description: "",
        offer: "",
        image: null,
      });
      toast.success("Course added successfully!");
    } catch (error) {
      console.error(
        "Error adding course:",
        error.response?.data || error.message
      );
    }
  };

  // Handle Edit Course
  const handleEditCourse = async () => {
    const formData = new FormData();
    formData.append("name", editCourse.name);
    formData.append("price", editCourse.price);
    formData.append("description", editCourse.description);
    formData.append("offer", editCourse.offer);

    // Append image if it's a new file
    if (editCourse.image && editCourse.image instanceof File) {
      formData.append("image", editCourse.image);
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/${selectedCourse._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the course in the list
      const updatedCourses = courses.map((course) =>
        course._id === selectedCourse._id ? response.data : course
      );

      setCourses(updatedCourses);
      setShowEditModal(false);
      setSelectedCourse(null);
      setEditCourse({ name: "", price: "", description: "", image: null });
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${selectedCourse._id}`);
      const updatedCourses = courses.filter(
        (course) => course._id !== selectedCourse._id
      );
      setCourses(updatedCourses);
      setShowDeleteConfirm(false);
      setSelectedCourse(null);
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Courses</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add New Course
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={
                course.image
                  ? `https://three60drivingschool.onrender.com/${course.image}`
                  : "https://via.placeholder.com/300?text=No+Image"
              }
              alt={course.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              course name : {course.name}
            </h3>
            <p className="text-sm text-gray-500">
              {" "}
              course description :{course.description}
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              course price : £ {course.price}
            </p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setEditCourse(course);
                  setShowEditModal(true);
                }}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedCourse(course);
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

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add New Course
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Course Name"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                required
              />
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  £
                </span>
                <input
                  type="number"
                  className="w-full pl-8 p-2 border border-gray-300 rounded-lg"
                  placeholder="Course Price"
                  value={newCourse.price}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  %
                </span>
                <input
                  type="number"
                  className="w-full pl-8 p-2 border border-gray-300 rounded-lg"
                  placeholder="Course Price"
                  value={newCourse.price}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, offer: e.target.value })
                  }
                  required
                />
              </div>

              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Course Description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                required
              />
              <div>
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => handleImageUpload(e, false)}
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleAddCourse}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Add Course
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

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit Course
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Course Name"
                value={editCourse.name}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, name: e.target.value })
                }
                required
              />
              <label className="block text-sm font-medium text-gray-700">
                Course Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  £
                </span>
                <input
                  type="text"
                  className="w-full p-2 pl-8 border border-gray-300 rounded-lg"
                  placeholder="Course Price"
                  value={editCourse.price}
                  onChange={(e) =>
                    setEditCourse({ ...editCourse, price: e.target.value })
                  }
                  required
                />
              </div>
              <label className="block text-sm font-medium text-gray-700">
                offer
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  %
                </span>
                <input
                  type="text"
                  className="w-full p-2 pl-8 border border-gray-300 rounded-lg"
                  placeholder="Course offer"
                  value={editCourse.offer}
                  onChange={(e) =>
                    setEditCourse({ ...editCourse, offer: e.target.value })
                  }
                  required
                />
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Course Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Course Description"
                value={editCourse.description}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, description: e.target.value })
                }
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course Image
                </label>
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleEditCourse}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
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
              Are you sure you want to delete this course?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteCourse}
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

export default CoursesPage;
