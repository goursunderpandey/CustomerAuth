import React, { useContext } from "react";
import { CustomerContext } from "../Context/Customercontext";
import { Link, useNavigate } from "react-router-dom";

const CustomerList = () => {
  const navigate = useNavigate();
  const { customers, deleteCustomer, setEditingCustomer } = useContext(CustomerContext);
  console.log(customers);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Customer List</h2>
      <table className="table table-striped table-hover">
        <thead >
          <tr>
            <th>Full Name</th>
            <th>Pan Card No</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>{customer.pancardno}</td>
              <td>{customer.mobile}</td>
              <td>{customer.email}</td>
              <td>
                <button 
                  className="btn btn-primary btn-sm mr-2" 
                  style={{marginRight:"10px"}}
                  onClick={() => { setEditingCustomer(customer); navigate("/Customerform"); }}>
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => deleteCustomer(customer.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/Customerform" className="btn btn-outline-primary">Add Customer</Link>
    </div>
  );
};

export default CustomerList;
