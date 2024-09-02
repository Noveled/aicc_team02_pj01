import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { changeCurrentPage } from "../../redux/slices/currentStateSlice";
import { useDispatch, useSelector } from 'react-redux';

function FooterNavIcon({ icon, linkTo, title, func }) {
  const [isHovered, setIsHovered] = useState(false);
  // const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentState.currentPage);

  useEffect(() => {
    // 페이지가 로딩될 때 isHovered 상태를 true로 변경
    if (currentPage['title'] === title){
      setIsHovered(true);
    }
  }, []);

  return (
    <button className="group" onClick={() => func({title})}>
      <Link to={linkTo}>
        <div
          className={`flex flex-col justify-center items-center tracking-wide text-[#888888] 
            ${isHovered && 'text-violet-600'}`}
        >
          {icon}
          <span className="text-[12px] pt-[1px]">{title}</span>
          <span className={`footer-navi-topsquare ${isHovered && 'scale-100'}`}></span>
        </div>
      </Link>
    </button>
  );
}

export default FooterNavIcon;
