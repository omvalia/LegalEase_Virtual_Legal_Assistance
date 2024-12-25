import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import FirstPage from './components/first_page.jsx'; 

import Navbar from './components/navbar.jsx';

import Slide from './components/Slide.jsx';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
import ForgetPass from './components/forgetpass.jsx'

import Workspace from './components/workspace.jsx';
import Lawgpt from './components/lawgpt.jsx'; 
import DocumentGenerate from './components/document_generation.jsx';
import NewsPage from './components/new_page.jsx';

import Header from './components/Header.jsx';
import RentForm from './components/rent_form.jsx';
import RentDetails from './components/rent_details.jsx';
import HouseSaleForm from './components/house_sale_form.jsx';
import HouseSaleDetails from './components/house_sale_details.jsx';
// import EmployeeAgreementTable from './components/EmployeeAgreementTable.jsx';
// import EmployeeAgreementForm from './components/EmployeeAgreementForm.jsx';
import AdoptionDeedTable from './components/AdoptionDeedTable.jsx';
import AdoptionDeedForm from './components/AdoptionDeedForm.jsx'
import BailPetitionTable from './components/BailPetitionTable.jsx';
import BailPetitionForm from './components/BailPetitionForm.jsx';

import WorkspaceNavigation from './components/workspace_naviagtion.jsx';
import OurClient from './components/our_client.jsx';
import Cases from './components/cases.jsx';
import Tasks from './components/tasks.jsx';
import Appointments from './components/appointments.jsx';
import CaseTable from './components/CaseTable.jsx';

import AddClientForm from './components/AddClientForm.jsx'
import ClientAppointments from './components/ClientAppointments.jsx';
import AddTaskForm from "./components/AddTaskForm.jsx";
import CaseForm from './components/CaseForm.jsx';

import EditProfile from './components/editprofile.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/navbar" element={<Navbar />} />

        <Route path="/slide" element={<Slide />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/forget_password" element={<ForgetPass />} />

        <Route path="/workspace" element={<Workspace />} />
        <Route path="/lawgpt" element={<Lawgpt />} />
        <Route path="/documentgenerate" element={<DocumentGenerate />} />
        <Route path="/news_page" element={<NewsPage />} />

        <Route path="/Header" element={<Header />} />
        <Route path="/rent_form" element={<RentForm />} />
        <Route path="/rent_details" element={<RentDetails />} />
        <Route path="/house_sale_form" element={<HouseSaleForm />} />
        <Route path="/house_sale_details" element={<HouseSaleDetails />} />
        {/* <Route path="/emloyee_agreeement_details" element={<EmployeeAgreementTable />} />
        <Route path="/agreement_form" element={<EmployeeAgreementForm />} /> */}
        <Route path="/adoption_details" element={<AdoptionDeedTable />} />
        <Route path="/adoption_form" element={<AdoptionDeedForm />} />
        <Route path="/bail_details" element={<BailPetitionTable />} />
        <Route path="/bail_form" element={<BailPetitionForm />} />

        <Route path="/workspace_naviagtion" element={<WorkspaceNavigation />} />
        <Route path="/our_client" element={<OurClient />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/appointments" element={<Appointments />} />\
        <Route path="/CaseTable" element={<CaseTable />} />\

        <Route path="/AddClientForm" element={<AddClientForm />} />
        <Route path="/ClientAppointments" element={<ClientAppointments />} />
        <Route path="/AddTaskForm" element={<AddTaskForm />} />
        <Route path="/CaseForm" element={<CaseForm />} />

        <Route path="/edit-profile" element={<EditProfile />} />

      </Routes>
    </Router>
  );
};

export default App;
