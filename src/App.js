import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import LandingPage from './screens/LandingPage';
import Signup from './screens/Signup';
import ALStudent from './screens/ALStudent';
import ElectiveSelection from './screens/ElectiveSelection';
import AdminMain from './screens/AdminMain';
import CourseReg from './screens/CourseReg';
import CourseDrop from './screens/CourseDrop';
import CourseEdit from './screens/CourseEdit';
import ALFaculty from './screens/ALFaculty';
import GenerateTT from './screens/GenerateTT';
import CourseView from './screens/CourseView';
import CourseCreate from './screens/CourseCreate';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path = "/" element = {<LandingPage></LandingPage>}></Route>
          <Route exact path = "/signup" element = {<Signup></Signup>}></Route>
          <Route exact path = "/alstudent" element = {<ALStudent></ALStudent>}></Route>
          <Route exact path = "/electiveselection" element = {<ElectiveSelection></ElectiveSelection>}></Route>
          <Route exact path = "/adminmain" element = {<AdminMain></AdminMain>}></Route>
          <Route exact path = "/coursereg" element = {<CourseReg></CourseReg>}></Route>
          <Route exact path = "/coursedrop" element = {<CourseDrop></CourseDrop>}></Route>
          <Route exact path = "/courseedit" element = {<CourseEdit></CourseEdit>}></Route>
          <Route exact path = "/alfaculty" element = {<ALFaculty></ALFaculty>}></Route>
          <Route exact path = "/generatett" element = {<GenerateTT></GenerateTT>}></Route>
          <Route exact path = "/courseview" element = {<CourseView></CourseView>}></Route>
          <Route exact path = "/coursecreate" element = {<CourseCreate></CourseCreate>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;