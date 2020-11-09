import logo from './logo.svg';
import react from 'react';
import './App.css';
import { Navbar, NavbarBrand } from 'reactstrap';


function App() {
  return (
    <div className="App">
       <Navbar dark color="primary">
         <div className="container">
           <NavbarBrand href="/">
             Kibanda
           </NavbarBrand>
         </div>
       </Navbar>
    </div>
  );
}

export default App;
