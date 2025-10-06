import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaCheck, FaTrash, FaEdit } from "react-icons/fa";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  clearAddressError,
} from "@/redux/slices/addressSlice";
import { useRouter } from "next/navigation";

const initialAddress = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  isDefault: false,
};

const AddressSection = ({
  selectedAddress,
  setSelectedAddress,
  setAddressSelected,
  addressSelected,
}) => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(initialAddress);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const router = useRouter();

  useEffect(() => {
    if (!showForm && error) {
      dispatch(clearAddressError());
    }
  }, [showForm, error, dispatch]);

  const resetForm = useCallback(() => {
    setCurrentAddress(initialAddress);
    setEditMode(false);
    setShowForm(false);
  }, []);

  const handleChange = (field, value) => {
    setCurrentAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await dispatch(
          updateAddress({ id: currentAddress._id, ...currentAddress })
        ).unwrap();
      } else {
        console.log("asdfghjk");
        const user = JSON.parse(localStorage.getItem("user")) || null;
        if (user) {
          await dispatch(addAddress(currentAddress)).unwrap();
        } else {
          localStorage.setItem("address", currentAddress);
          router.push("/login");
        }
      }
      await dispatch(fetchAddresses());
      resetForm();
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  const handleEdit = (address) => {
    setCurrentAddress(address);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteAddress(id)).unwrap();
        if (selectedAddress?._id === id) setSelectedAddress(null);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Shipping Addresses</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm((prev) => !prev);
          }}
          className="text-primary flex items-center gap-1 text-sm"
        >
          <FaPlus size={12} /> {showForm ? "Cancel" : "Add New"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 border rounded-lg bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <InputField
              label="Full Name*"
              type="text"
              value={currentAddress.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
            <InputField
              label="Phone Number*"
              type="tel"
              value={currentAddress.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>

          <InputField
            label="Street Address*"
            type="text"
            value={currentAddress.street}
            onChange={(e) => handleChange("street", e.target.value)}
            required
            className="mb-3"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <InputField
              label="City*"
              type="text"
              value={currentAddress.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required
            />
            <InputField
              label="State*"
              type="text"
              value={currentAddress.state}
              onChange={(e) => handleChange("state", e.target.value)}
              required
            />
            <InputField
              label="ZIP Code*"
              type="text"
              value={currentAddress.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="defaultAddress"
              checked={currentAddress.isDefault}
              onChange={(e) => handleChange("isDefault", e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="defaultAddress" className="text-sm">
              Set as default address
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : editMode
                ? "Update Address"
                : "Save Address"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      ) : (
        <div className="space-y-3">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address._id}
                onClick={() => {
                  setSelectedAddress(address);
                  setAddressSelected(!addressSelected);
                }}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  // selectedAddress?._id === address._id
                  addressSelected
                    ? "border-2 border-primary bg-primary/5"
                    : "hover:border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} - {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* {selectedAddress?._id === address._id && ( */}
                    {addAddress && <FaCheck className="text-primary mt-1" />}
                    <IconBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(address);
                      }}
                      icon={<FaEdit />}
                      className="text-gray-500 hover:text-primary"
                    />
                    <IconBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(address._id);
                      }}
                      icon={<FaTrash />}
                      className="text-gray-500 hover:text-red-500"
                    />
                  </div>
                </div>
                {address.isDefault && (
                  <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded mt-2">
                    Default
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              {loading
                ? "Loading addresses..."
                : "No addresses saved. Please add a new address."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, className = "", ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full p-2 border rounded focus:ring-1 focus:ring-primary"
    />
  </div>
);

const IconBtn = ({ onClick, icon, className }) => (
  <button onClick={onClick} className={className}>
    {icon}
  </button>
);

export default AddressSection;
