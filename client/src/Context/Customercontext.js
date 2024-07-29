import React, { createContext, useReducer, useState } from "react";

const CustomerContext = createContext();

const initialState = {
  customers: [],
};

const customerReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CUSTOMER":
      return { ...state, customers: [...state.customers, action.payload] };
    case "EDIT_CUSTOMER":
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
    case "DELETE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

const CustomerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const addCustomer = (customer) => {
    console.log(customer);
    dispatch({ type: "ADD_CUSTOMER", payload: customer });
  };

  const editCustomer = (customer) => {
    dispatch({ type: "EDIT_CUSTOMER", payload: customer });
    setEditingCustomer(null);
  };

  const deleteCustomer = (id) => {
    dispatch({ type: "DELETE_CUSTOMER", payload: id });
  };

  return (
    <CustomerContext.Provider
      value={{
        customers: state.customers,
        addCustomer,
        editCustomer,
        deleteCustomer,
        editingCustomer,
        setEditingCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export { CustomerContext, CustomerProvider };
