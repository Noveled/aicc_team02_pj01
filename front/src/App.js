import { Routes, Route, HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Intro from "./components/Intro";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Search from "./components/NaviBar/Search";
import Box from "./components/NaviBar/Box";
import MakeCourse from "./components/NaviBar/MakeCourse";
import UpdateCourse from "./components/Filter/UpdateCourse";
import MyPage from "./components/NaviBar/MyPage";
import Detail from "./components/Filter/Detail";

// 맵 기능 구현 테스트
import PolyMap from "./components/PolyMap";
import DirectionMap from "./components/DirectionMap";
import FacilitiesMap from "./components/FacilitiesMap";
import Main from "./components/Main";
import SliderTest from "./components/SliderTest";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/search" element={<Search />} />
          <Route path="/box" element={<Box />} />
          <Route path="/make_course" element={<MakeCourse />} />
          <Route path="/update_course" element={<UpdateCourse />} />
          <Route path="/mypage" element={<MyPage />} />

          <Route path="/detail" element={<Detail />} />
          <Route path="/main" element={<Main />} />
          {/* 기능 구현 테스트 페이지 */}
          <Route path="/polyMap" element={<PolyMap />} />
          <Route path="/directMap" element={<DirectionMap />} />
          <Route path="/facilMap" element={<FacilitiesMap />} />
          <Route path="/slider" element={<SliderTest />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={1500} theme="light" />
      </HashRouter>
    </div>
  );
}

export default App;
