import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.scss';
import LoginCard from './components/loginCard';
import ErrorPage from "./components/errorPage";
import Layout from './components/layout';
import States from "./context/states";
import Dashboard from "./components/dashboard";
import Salary from "./components/salary";
import Employee from "./components/employee";
import Profile from "./components/profile";
import Loan from "./components/loan";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginCard />,
      errorElement: <ErrorPage />
      
    },
    {
      path: "/home",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [{
        path: "dashboard",
        element: <Dashboard/>,
        errorElement: <ErrorPage />
      }, {
        path: "salary",
        element: <Salary />,
        errorElement: <ErrorPage />
      }, {
        path: "loan",
        element: <Loan />,
        errorElement: <ErrorPage />
      }, {
        path: "employee",
        element: <Employee/>,
        errorElement: <ErrorPage />
      }, {
        path: "profile",
        element: <Profile/>,
        errorElement: <ErrorPage />
      }]
    },
  ], {
    basename: "/SalarySync"
  });
  return (
    <div className="App">
      <States>
        <RouterProvider router={router}/>
      </States>
    </div> 
  );
}

export default App;
