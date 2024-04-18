import "./App.css";
import { useState, useEffect } from "react";

export default function Suppliers() {
    const apiUrl = "http://localhost:8080/api/v1/payment/get-suppliers";
    // const headers = {
    //     "Content-Type": "application/json",
    //   };
    
    //   const options = {
    //     headers: headers,
    //   };
    useEffect(()=>{
        fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log("Response:", data.splice(0,20));
         
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },[]);
  return (
    <>
      <div>HELLO</div>
    </>
  );
}
