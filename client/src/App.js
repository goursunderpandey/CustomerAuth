import React from "react";
import Mainpage from "../src/Pages/MainPage"
import { CustomerProvider } from "./Context/Customercontext";
import { BrowserRouter as Router }
    from "react-router-dom";
function App() {
  return (
    <div>
      <>
        <CustomerProvider>
          <Router>
          <Mainpage />

          </Router>
        </CustomerProvider>
      </>
    </div>
  );

}
export default App;
