// document.addEventListener("DOMContentLoaded", function () {
//   console.log("DOM fully loaded and parsed");

//   const form = document.querySelector("#purchase-form");
//   const getBaseUrl = `${window.location.protocol}//${window.location.host}`;
//   console.log("Base URL:", getBaseUrl);

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     console.log("Form submitted");

//     const amount = document.querySelector(".pay").innerText.replace("Pay $", "");
//     const email = document.getElementById("email").value;
//     const name = document.getElementById("name").value;
//     const itemId = form.dataset.itemId;

//     console.log("Amount:", amount);
//     console.log("Email:", email);
//     console.log("Name:", name);
//     console.log("Item ID:", itemId);

//     try {
//       console.log("Initiating Flutterwave checkout");
//       FlutterwaveCheckout({
//         public_key: "FLWPUBK_TEST-b3755023095a7d59d52636b219e61c79-X",
//         tx_ref: "AK_" + Math.floor(Math.random() * 1000000000 + 1),
//         amount: amount,
//         currency: "USD",
//         payment_options: "card",
//         customer: {
//           email: email,
//           name: name,
//         },
//         callback: async (data) => {
//           console.log("Payment completed, callback triggered");
//           console.log("Callback data:", data);

//           const reference = data.tx_ref;
//           console.log("Transaction reference:", reference);

//           // Communicate with the backend
//           console.log("Sending POST request to backend");
//           try {
//             const response = await fetch(`${getBaseUrl}/api/purchases`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({
//                 item: itemId,
//                 buyerName: name,
//                 buyerEmail: email,
//                 price: amount,
//                 paid: true
//               })
//             });

//             console.log("Awaiting backend response");
//             const result = await response.json();
//             console.log("Backend response received");

//             if (result.status === 'success') {
//               console.log("Backend response status: success");
//               alert('Payment complete! Reference: ' + reference);
//               window.location.href = `${getBaseUrl}/payment-success?tx_ref=${reference}`;
//             } else {
//               console.error("Backend response status: error", result);
//               alert('Error processing payment. Please try again.');
//             }
//           } catch (error) {
//             console.error('Error communicating with the backend:', error);
//           }
//         },
//         customizations: {
//           title: "AppKinda",
//           description: "FlutterWave Integration in Javascript.",
//           // logo: "flutterwave/usecover.gif",
//         },
//       });
//     } catch (error) {
//       console.error('Error initiating payment:', error);
//     }
//   });
// });
