// import React from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
// import Navbar from "./navbar";
// import { FaHome, FaGavel, FaFileContract, FaChild, FaBuilding } from "react-icons/fa"; // Updated icons
// import "../css/document.css";

// const DocumentGenerate = () => {
//     const navigate = useNavigate(); // Initialize the navigate function

//     const documents = [
//         {
//             icon: <FaHome size={50} />,
//             name: "Lease Deed Rent Agreement",
//             description: "A legal contract between a landlord and a tenant for renting property.",
//             details: "This document defines the terms of rent, duration, and responsibilities of both parties.",
//             route: "/rent_details"  // Define the route for this document
//         },
//         {
//             icon: <FaBuilding size={50} />,
//             name: "House Sale Agreement",
//             description: "An agreement for the sale of residential property.",
//             details: "A document outlining the terms of the sale, including payment structure and possession transfer.",
//             route: "/house_sale_details"  // Define the route for this document
//         },
//         {
//             icon: <FaFileContract size={50} />,
//             name: "Employee Service Agreement",
//             description: "An agreement outlining the terms of employment between an employer and an employee.",
//             details: "This contract includes job responsibilities, salary, benefits, and the duration of employment.",
//             route: "/service_agreement_details"  // Define the route for this document
//         },
//         {
//             icon: <FaGavel size={50} />,  // Updated icon for Anticipatory Bail Petition
//             name: "Anticipatory Bail Petition",
//             description: "A legal petition requesting pre-arrest bail.",
//             details: "Filed to seek protection from arrest in anticipation of criminal charges.",
//             route: "/bail_details"  // Define the route for this document
//         },
//         {
//             icon: <FaChild size={50} />,  // Updated icon for Adoption Deed
//             name: "Adoption Deed",
//             description: "A legal document to formalize the adoption of a child.",
//             details: "This deed establishes the legal transfer of parental rights to the adoptive parents.",
//             route: "/adoption_details"  // Define the route for this document
//         },
//     ];

//     const handleCardClick = (route) => {
//         navigate(route);  // Navigate to the provided route
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="document-container">
//                 <h1>Select the document to generate</h1>
//                 <div className="cards-container">
//                     {documents.map((doc, index) => (
//                         <div
//                             key={index}
//                             className="document-card"
//                             onClick={() => handleCardClick(doc.route)} // On card click, navigate to route
//                         >
//                             <div className="icon">{doc.icon}</div>
//                             <h4>{doc.name}</h4>
//                             <p>{doc.description}</p>
//                             <div className="details">{doc.details}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default DocumentGenerate;

import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Navbar from "./navbar";
import {
  FaHome,
  FaGavel,
  FaFileContract,
  FaChild,
  FaBuilding,
} from "react-icons/fa"; // Updated icons
import "../css/document.css";

const DocumentGenerate = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const documents = [
    {
      icon: <FaHome size={50} />,
      name: "Lease Deed Rent Agreement",
      description:
        "A legal contract between a landlord and a tenant for renting property.",
      details:
        "This document defines the terms of rent, duration, and responsibilities of both parties.",
      route: "/rent_details", // Define the route for this document
    },
    {
      icon: <FaBuilding size={50} />,
      name: "House Sale Agreement",
      description: "An agreement for the sale of residential property.",
      details:
        "A document outlining the terms of the sale, including payment structure and possession transfer.",
      route: "/house_sale_details", // Define the route for this document
    },
    // {
    //     icon: <FaFileContract size={50} />,
    //     name: "Employee Service Agreement",
    //     description: "An agreement outlining the terms of employment between an employer and an employee.",
    //     details: "This contract includes job responsibilities, salary, benefits, and the duration of employment.",
    //     route: "/emloyee_agreeement_details"  // Define the route for this document
    // },
    {
      icon: <FaGavel size={50} />, // Updated icon for Anticipatory Bail Petition
      name: "Anticipatory Bail Petition",
      description: "A legal petition requesting pre-arrest bail.",
      details:
        "Filed to seek protection from arrest in anticipation of criminal charges.",
      route: "/bail_details", // Define the route for this document
    },
    {
      icon: <FaChild size={50} />, // Updated icon for Adoption Deed
      name: "Adoption Deed",
      description: "A legal document to formalize the adoption of a child.",
      details:
        "This deed establishes the legal transfer of parental rights to the adoptive parents.",
      route: "/adoption_details", // Define the route for this document
    },
  ];

  const handleCardClick = (route) => {
    navigate(route); // Navigate to the provided route
  };

  return (
    <>
      <Navbar />
      <div className="docs">
      <div className="document-container">
        <h1>Select the document to generate</h1>
        <div className="cards-container">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="document-card"
              onClick={() => handleCardClick(doc.route)}
            >
              <div className="icon">{doc.icon}</div>
              <h4>{doc.name}</h4>
              <p>{doc.description}</p>
              <div className="details">{doc.details}</div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default DocumentGenerate;
