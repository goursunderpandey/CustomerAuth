import React, { useState, useContext, useEffect } from "react";
import { CustomerContext } from "../Context/Customercontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerForm = () => {
  const navigate = useNavigate();
  const { addCustomer, editCustomer, editingCustomer, setEditingCustomer } =
    useContext(CustomerContext);
    console.log(editCustomer,"565585");
  const [customer, setCustomer] = useState({
    pancardno: "",
    fullName: "",
    email: "",
    mobile: "",
    addresses: [{ line1: "", line2: "", postcode: "", state: "", city: "" }],
  });
  const [panError, setPanError] = useState("");

  useEffect(() => {
    if (editingCustomer) {
      setCustomer(editingCustomer);
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const addresses = [...customer.addresses];
    addresses[index] = { ...addresses[index], [name]: value };
    setCustomer({ ...customer, addresses });
  };

  const handleAddAddress = () => {
    if (customer.addresses.length < 10) {
      setCustomer({
        ...customer,
        addresses: [
          ...customer.addresses,
          { line1: "", line2: "", postcode: "", state: "", city: "" },
        ],
      });
    }
  };

  const handleRemoveAddress = (index) => {
    const addresses = customer.addresses.filter((_, i) => i !== index);
    setCustomer({ ...customer, addresses });
  };

  const validatePANFormat = (panNumber) => {
    const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
    return panRegex.test(panNumber);
};

  const verifyPAN = async (panNumber) => {
    if (!validatePANFormat(panNumber)) {
      setPanError("Invalid PAN format");
      return;
    } else {
      setPanError("");
    }

    axios
      .post(
        "https://lab.pixel6.co/api/verify-pan.php",
        JSON.stringify({ panNumber }),
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      .then((res) => {
        const data = res.data;
        if (data.isValid) {
          setCustomer({ ...customer, fullName: data.fullName, pancardno: panNumber });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchPostcodeDetails = async (postcode, index) => {
    axios
      .post(
        "https://lab.pixel6.co/api/get-postcode-details.php",
        JSON.stringify({ postcode }),
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      .then((response) => {
        const data = response.data;
        if (data.statusCode === 200) {
          const addresses = [...customer.addresses];
          addresses[index] = {
            ...addresses[index],
            state: data.state[0].name,
            city: data.city[0].name,
            postcode: postcode,
          };
          setCustomer({ ...customer, addresses });
        }
      })
      .catch((error) => {
        console.log(error.config);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(e,"4554");
    if (panError) return;
    if (editingCustomer) {
      editCustomer(customer);
    } else {
      addCustomer({ ...customer, id: Date.now() });
    }
    setCustomer({
      pancardno: "",
      fullName: "",
      email: "",
      mobile: "",
      addresses: [{ line1: "", line2: "", postcode: "", state: "", city: "" }],
    });
    setEditingCustomer(null);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="pan">Pancard No :</label>
          <input
            type="text"
            className={`form-control ${panError ? "is-invalid" : ""}`}
            id="pancardno"
            name="pancardno"
            value={customer.pancardno}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value.length === 10) {
                verifyPAN(e.target.value);
              }
            }}
            placeholder="Pancard No"
            required
            maxLength="10"
          />
          {panError && <div className="invalid-feedback">{panError}</div>}
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            name="fullName"
            value={customer.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            maxLength="140"
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            placeholder="Email"
            required
            maxLength="255"
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="mobile">Mobile Number</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">+91</span>
            </div>
            <input
              type="text"
              className="form-control"
              id="mobile"
              name="mobile"
              value={customer.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              required
              maxLength="10"
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "15px" }}>
        {customer.addresses.map((address, index) => (
          <div key={index} className="border p-3 mb-3">
            <h5>Customer Address No : {index + 1}</h5>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor={`line1-${index}`}>Address Line 1</label>
                <input
                  type="text"
                  className="form-control"
                  id={`line1-${index}`}
                  name="line1"
                  value={address.line1}
                  onChange={(e) => handleAddressChange(index, e)}
                  placeholder="Address Line 1"
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor={`line2-${index}`}>Address Line 2</label>
                <input
                  type="text"
                  className="form-control"
                  id={`line2-${index}`}
                  name="line2"
                  value={address.line2}
                  onChange={(e) => handleAddressChange(index, e)}
                  placeholder="Address Line 2"
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-4">
                <label htmlFor={`postcode-${index}`}>Postcode</label>
                <input
                  type="number"
                  className="form-control"
                  id={`postcode-${index}`}
                  name="postcode"
                  value={address.postcode}
                  onChange={(e) => {
                    handleAddressChange(index, e);
                    if (e.target.value.length === 6) {
                      fetchPostcodeDetails(e.target.value, index);
                    }
                  }}
                  placeholder="Postcode"
                  required
                  maxLength="6"
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor={`state-${index}`}>State</label>
                <input
                  type="text"
                  className="form-control"
                  id={`state-${index}`}
                  name="state"
                  value={address.state}
                  onChange={(e) => handleAddressChange(index, e)}
                  placeholder="State"
                  required
                  readOnly
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor={`city-${index}`}>City</label>
                <input
                  type="text"
                  className="form-control"
                  id={`city-${index}`}
                  name="city"
                  value={address.city}
                  onChange={(e) => handleAddressChange(index, e)}
                  placeholder="City"
                  required
                  readOnly
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-danger m-3"
              onClick={() => handleRemoveAddress(index)}
              
            >
              Remove Address
            </button>
          </div>
        ))}
      </div>

      <div className="row">
        {customer.addresses.length < 10 && (
          <button
            type="button"
            className="btn btn-primary  col-2"
            onClick={handleAddAddress}
            style={{paddingRight:"10px"}}
          >
            Add Address
          </button>
        )}
        <button type="submit" className="btn btn-success col-3 ">
          {editingCustomer ? "Update Customer" : "Add Customer"}
        </button>

      </div>

    </form>
  );
};

export default CustomerForm;
