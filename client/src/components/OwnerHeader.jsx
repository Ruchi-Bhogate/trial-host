import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import ChatModal from "./ChatModal";
import { Button, AppBar, Toolbar, StepLabel } from "@mui/material";

 
    const Header = () =>{
      const [isModalOpen, setModalOpen] = useState(false);
      return (
      <>
       <div>
           <AppBar sx ={{background:'#1c1a1a',opacity:'0.8'}}>
             <Toolbar>
               <StepLabel icon={ <img src={require("../images/ubook.png")} alt="" width="110" height="50" /> } />
               <Button sx={{marginRight: "auto"}} variant="contained" href="/ownerdashboard">Dashboard</Button>
               <Button sx={{marginRight: "auto"}} variant="contained" href="/postbook">Post Book</Button>
               <Button sx={{marginRight: "auto"}} variant="contained" href="/rentedoutbooks">Rented Out Books</Button>
               <Button sx={{marginRight: "auto"}} variant="contained" href="/ownerprofile">OwnerProfile</Button>
               <Button sx={{marginRight: "auto"}} variant="contained" href="/logout">Logout</Button>
               <Button sx={{marginRight: "auto"}} variant ="contained" onClick={()=> {setModalOpen(true)}}>Chat with Admin</Button>
             </Toolbar>
           </AppBar>
       </div>
      <ChatModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        withId="6574958e873155beaed7d163"
        withType="admin"
        title="Admin"
      />
    </>
  );
}
export default Header;