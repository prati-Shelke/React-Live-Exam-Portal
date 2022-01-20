import react , {useState,useEffect} from "react";
import Question from './AddQuestionForm';
import './App.css'
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import QuestionList from "./QuestionList";
import AddQuestionForm from "./AddQuestionForm";
import EditQuestionForm from "./EditQuestionForm"
import Footer from "./Footer"
import NavBar from "./NavBar";
import RecaptchaComponent from "./RecaptchaComponent";



function App() {
 
  const [display,setDisplay] = useState(true)
  const handleDisplayNavbar = (val) =>
    {
      setDisplay(val)
    }
  
  const accessToken = JSON.parse(localStorage.getItem('token'))
  const googleToken = JSON.parse(localStorage.getItem('googleToken'))

  return (
    <div className="App">
      {/* {display===true ? 
      <NavBar /> : <></>} */}

      { accessToken || googleToken ?
      <>
              <Router>
                <Routes>
                    <Route path="*" element={<Navigate to ="/QuestionList" />}/>
                    <Route path="/QuestionList" element={<QuestionList display={display} />} />
                    <Route path="/AddQuestionForm" element={<AddQuestionForm handleDisplayNavbar={handleDisplayNavbar} display={display}/>} /> 
                    <Route path="/EditQuestionForm/:id" element={<EditQuestionForm handleDisplayNavbar={handleDisplayNavbar} display={display}/>} /> 
                </Routes>
              </Router>
            
            <Footer/> 
      </>  
       :
        <>
              <Router>
                <Routes>
                    <Route path="*" element={<Navigate to ="/Login" />}/>
                    <Route path="/Login" element={<RecaptchaComponent />} />
                    <Route path="/QuestionList" element={<QuestionList display={display} />} />
                    <Route path="/AddQuestionForm" element={<AddQuestionForm handleDisplayNavbar={handleDisplayNavbar} display={display}/>} /> 
                    <Route path="/EditQuestionForm/:id" element={<EditQuestionForm handleDisplayNavbar={handleDisplayNavbar} display={display}/>} /> 
                </Routes>
              </Router>
            
            <Footer/>
        </>
      }
    </div>
  );
}

export default App;


// return (
//   <div className="App">
//     {/* {display===true ? 
//     <NavBar /> : <></>} */}
//       <Router>
//         <Routes>
//             <Route path="*" element={<Navigate to ="/Login" />}/>
//             <Route path="/Login" element={<RecaptchaComponent />} />
//             <Route path="/QuestionList" element={<QuestionList display={display} />} />
//             <Route path="/AddQuestionForm" element={<AddQuestionForm handleDisplayNavbar={handleDisplayNavbar} display={display}/>} /> 
//             <Route path="/EditQuestionForm/:id" element={<EditQuestionForm handleDisplayNavbar={handleDisplayNavbar} display={display}/>} /> 
//         </Routes>
//     </Router>
    
//     <Footer/>
//   </div>
// );