import { Routes, Route, Navigate } from "react-router-dom";
import WizardPage from "../pages/WizardPage";
import EmployeesPage from "../pages/EmployeesPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/wizard?role=admin" replace />} />
      <Route path="/wizard" element={<WizardPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
    </Routes>
  );
};

export default AppRouter;
