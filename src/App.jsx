import "./App.css";
import { useState, useEffect } from "react";
function App() {
  const submitPayment = () => {
    myFatoorah.submit().then(
      function (response) {
        var cardBrand = response.cardBrand; //cardBrand will be one of the following values: Master, Visa, Mada, Amex
        let body = {
          sessionId: response.sessionId,
          invoiceValue: 10,
        };

        const options = {
          method: "POST",
          body: JSON.stringify(body), // must stringify!!!!!!!!!!!!!!!!
          headers: headers,
        };
        const executePaymentApi =
          "http://localhost:8080/api/v1/payment/execute-payment";

        fetch(executePaymentApi, options)
          .then((response) => response.json())
          .then((data) => {
            document.getElementById("card-element").remove();
            document.getElementById("payNowBtn").remove();
            let url = data.Data.PaymentURL;

            url += "&iframeEnabled=true";
            let iframe = document.querySelector("#otpIframe");
            iframe.style.display = "block";
            iframe.src = url;
            // redirect in blank to another page
            console.log("Response:", data);
            // redirect in _blank window to the otp window of myfatoorah
          })
          .catch((error) => {
            console.error("Error:", error);
            // Handle errors
          });
      },
      function (error) {
        let errorElement = document.querySelector("#paymentErr");
        errorElement.style.visibility = "visible";
      }
    );
  };

  // assume I've clicked on a button and have been redirected to the payment page
  // assume we've received user's id from request params - for now pretend it's a local variable
  const userId = 10;
  const [sessionIdd, setSessionId] = useState("");

  // Endpoint from server side to fix CORS issue
  const apiUrl = "http://localhost:8080/api/v1/payment/initiate-payment";

  const body = JSON.stringify({
    CustomerIdentifier: userId,
  });
  const headers = {
    "Content-Type": "application/json",
  };

  const options = {
    method: "POST",
    body: body,
    headers: headers,
  };

  useEffect(() => {
    var sessionIdFetched;

    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);
        sessionIdFetched = data.Data.SessionId;
        var config = {
          countryCode: "KWT", // Here, add your Country Code you receive from InitiateSession Endpoint.
          sessionId: sessionIdFetched, // Here you add the "SessionId" you receive from InitiateSession Endpoint.
          cardViewId: "card-element",
        };
        var flag = false;
        const cardElement = document.getElementById("card-element");
        for (let i = 0; i < cardElement.childNodes.length; i++) {
          if (cardElement.childNodes[i].tagName === "IFRAME") {
            flag = true;
            break;
          }
        }
        if (!flag) {
          myFatoorah.init(config);
          setSessionId(sessionIdFetched);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  }, []);

  //The event listener is used to listen to the Redirection URL after the  customer completes the 3DS Challenge
  window.addEventListener(
    "message",
    function (event) {
      if (!event.data) return;
      try {
        //The redirection URL is returned in the message
        var message = JSON.parse(event.data);

        //Proceed only with the following steps if the sender is exactly "MF-3DSecure"
        if (message.sender == "MF-3DSecure") {
          var url = message.url;
          // REDIRECT TO WHEREEVER YOU WANT
          // COURSE PAGE, FOR INSTANCE
          //Here, you need to handle the next action, and here are some suggestions:
          //Redirect the full page to the received URL.
          //Load the received URL in your iframe.
          //Close the iframe and display the result on the same page. You can use AJAX requests to your server with the payment ID to confirm the transaction status (invoke GetPaymentStatus) and display the result accordingly.
        }
      } catch (error) {
        return;
      }
    },
    false
  );

  return (
    <>
      <div id="card-element"></div>
      <button onClick={submitPayment} id="payNowBtn">
        Pay Now
      </button>
      <div
        id="paymentErr"
        style={{ visibility: "hidden", color: "red", paddingTop: "15px" }}
      >
        Card details are invalid or missing!
      </div>
      <iframe
        src=""
        id="otpIframe"
        style={{
          display: "none",
          width: "90%",
          height: "70%",
          margin: "0 auto",
        }}
      ></iframe>
      <a href="#" id="goBackLink" style={{display:"none"}}>GO BACK</a>
    </>
  );
}

export default App;
