import './App.css';
import 'antd/dist/reset.css'; // Import CSS của Ant Design
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashBoard from './components/AdminDashboard/AdminPage/AdminPage';
import CustomerPage from './components/CustomerDashboard/CustomerPage';


function App() {

  return (
    <Router>
      <main className="App">
        <Routes>
          {/* Đặt AdminPagetại route chính */}
          <Route path='/admin/*' element={<AdminDashBoard/>} />
          <Route path='/*' element = {<CustomerPage/>}/>

        </Routes>
      </main>
    </Router>
  );
}

export default App;