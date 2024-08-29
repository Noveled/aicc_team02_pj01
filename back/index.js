const express = require("express"); // express 모듈 불러오기
const cors = require("cors"); // cors 모듈 불러오기
const cookieParser = require("cookie-parser");

const PORT = "8080";

const app = express(); // express 모듈을 사용하기 위해 app 변수에 할당
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(require("./routes/getRoutes"));
app.use(require("./routes/postRoutes"));
app.use(require("./routes/putRoutes"));
app.use(require("./routes/deleteRoutes"));

// 서버 경로 설정 (이미지 업로드 파일 접근)
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => console.log(`server is running on ${PORT}`)); // 서버실행 메세지
