import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./components/Intro";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Search from "./components/NaviBar/Search";
import Box from "./components/NaviBar/Box";
import MakeCourse from "./components/NaviBar/MakeCourse";
import MyPage from "./components/NaviBar/MyPage";
import Detail from "./components/Filter/Detail";

// 맵 기능 구현 테스트
import PolyMap from "./components/PolyMap";
import DirectionMap from "./components/DirectionMap";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/search" element={<Search />} />
          <Route path="/box" element={<Box />} />
          <Route path="/make_course" element={<MakeCourse />} />
          <Route path="/mypage" element={<MyPage />} />

          <Route path="/detail" element={<Detail />} />

          {/* 기능 구현 테스트 페이지 */}
          <Route path="/polyMap" element={<PolyMap />} />
          <Route path="/directMap" element={<DirectionMap />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
