import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
const API_BASE_URL = "https://three60drivingschool.onrender.com/user";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: value,
    });
  };

  const addNewUser = async () => {
    if (newUser.name && newUser.email && newUser.password) {
      const confirmAdd = window.confirm(
        "Are you sure you want to add this user?"
      );
      if (!confirmAdd) return;

      try {
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) throw new Error("Failed to add user");
        setNewUser({ name: "", email: "", role: "", password: "" }); // Reset form
        fetchUsers(); // Refresh the user list
        toast.success("User added successfully!");
      } catch (error) {
        console.error(error.message);
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) throw new Error("Failed to update user");
      setEditingUser(null); // Close edit form
      fetchUsers(); // Refresh the user list
      toast.success("User updated successfully!");
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");
      fetchUsers(); // Refresh the user list
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Admin - Manage Users
        </h1>
      </header>

      {/* Add New User Form */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Add New User
        </h2>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border p-2 w-full rounded mb-2"
          />

          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="border p-2 w-full rounded mb-2"
          />
        </div>
        <button
          onClick={addNewUser}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Edit User
            </h2>
            <input
              type="text"
              name="name"
              value={editingUser.name}
              onChange={handleEditInputChange}
              placeholder="Name"
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="email"
              name="email"
              value={editingUser.email}
              onChange={handleEditInputChange}
              placeholder="Email"
              className="border p-2 w-full rounded mb-2"
            />

            <input
              type="password"
              name="password"
              value={editingUser.password}
              onChange={handleEditInputChange}
              placeholder="Password"
              className="border p-2 w-full rounded mb-2"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={updateUser}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-700"
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

export default AdminUsersPage;
