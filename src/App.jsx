import React, { useState, useEffect } from "react";
import {MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

export default function App() {
  const [users, setUsers] = useState([]);
  const [userPopup, setUserPopup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNo] = useState("");

  const isEdit = editUser !== null;

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);
  const addUser = async () => {
  if (!name.trim() || !email.trim() || !phone.trim()) {
    alert("Please fill all fields");
    return; 
  }

  const addUser = async () => {
    const res = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "content-type": "application/json" },  
      body: JSON.stringify({
        firstName: name,
        email,
        phone,
      }),
    });

    const newUser = await res.json();
    setUsers([...users, newUser]);
    clearForm();
  };

  const updateUser = async () => {
    const res = await fetch(`https://dummyjson.com/users/${editUser.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstName: name,
        email,
        phone,
      }),
    });

    const updated = await res.json();
    setUsers(users.map((u) => (u.id === editUser.id ? updated : u)));
    clearForm();
  };

  const deleteUser = async (id) => {
    await fetch(`https://dummyjson.com/users/${id}`, { method: "DELETE" });
    setUsers(users.filter((u) => u.id !== id));
  };

  const startEdit = (u) => {
    setEditUser(u);
    setName(u.firstName);
    setEmail(u.email);
    setPhoneNo(u.phone);
    setUserPopup(true);
  };

  const clearForm = () => {
    setEditUser(null);
    setName("");
    setEmail("");
    setPhoneNo("");
    setUserPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* HEADER */}
      <h1 className="text-sky-400 text-2xl sm:text-3xl font-bold text-center mb-6">
        CRUD Operation
      </h1>

      {/* ADD BUTTON */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-sky-400">
          User List
        </h2>

        <button
          onClick={() => setUserPopup(true)}
          className="bg-sky-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-sky-600 hover:cursor-pointer"
        >
          Add User
        </button>
      </div>

      {/* POPUP */}
      {userPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[90%] sm:w-[500px] md:w-[600px] lg:w-[650px]">
            {/* TOP BAR */}
            <div className="bg-sky-400 text-white px-6 py-3 flex rounded-t-lg items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {isEdit ? "Edit User" : "Add User"}
              </h2>

              <button
                className="text-white text-2xl hover:cursor-pointer"
                 onClick={clearForm}
              >
                <RxCross2 />

              </button>
            </div>

            {/* FORM */}
            <form className="p-6 space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Name"
                className="w-full border p-3 rounded mb-2"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                className="w-full border p-3 rounded mb-2"
                required
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="Enter your Phone Number"
                className="w-full border p-3 rounded mb-2"
                required
              />

              <div className="flex justify-center">
                <button
                
                  onClick={(e)=>{
                    e.preventDefault();
                    isEdit ? updateUser : addUser
                  }}
                  
                  className="bg-sky-400 text-white px-5 py-2 rounded hover:bg-sky-500 hover:cursor-pointer"
                >
                  {isEdit ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4 ">
          <div className="bg-white w-[90%] sm:w-80 p-6 rounded-2xl shadow-2xl text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this user?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-400 px-4 py-2 rounded-lg text-white hover:bg-gray-500 hover:cursor-pointer"
                onClick={() => setConfirmDelete(null)}
              >
                No
              </button>

              <button
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 hover:cursor-pointer"
                onClick={() => {
                  deleteUser(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE AREA */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border border-gray-500 shadow-blue-100 shadow-lg">
          <thead>
            <tr className="bg-sky-400 text-white">
              <th className="border p-3">S.No</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">PhoneNo</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr
                key={u.id}
                className={`text-center ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } text-gray-600 hover:bg-gray-200 transition`}
              >
                <td className="border p-3">{index + 1}</td>
                <td className="border p-3">{u.firstName}</td>
                <td className="border p-3">{u.email}</td>
                <td className="border p-3">{u.phone}</td>

                <td className="border-b p-3  flex justify-center gap-3">
                  <button
                    onClick={() => startEdit(u)}
                    className="bg-blue-400 text-white px-2 py-1 size-8 rounded-full hover:cursor-pointer"
                  >
                    <MdEdit />
                  </button>

                  <button
                    onClick={() => setConfirmDelete(u.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-full hover:cursor-pointer "
                  >
                    <RxCross2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
}
