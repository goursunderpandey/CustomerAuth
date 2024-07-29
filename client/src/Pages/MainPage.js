import React from 'react'
import CustomerForm from '../Components/CustomerForms'
import CustomerList from '../Components/CustomerList'
import { Route,  Routes } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <Routes> 
      <Route exact path="/" element={<CustomerList />} />
      <Route exact path="/Customerform" element={<CustomerForm />} />
       </Routes>
    </div>
  )
}

export default MainPage
