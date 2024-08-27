import React from 'react'

const CourseData = ({data, func}) => {
  // console.log('c', data);
  // console.log('d', data.center);

  return (
    <div className='my-4'>
      <div className='grid grid-cols-4 gap-2'>
        <span>코스명 : {data.course_name}</span>
        <span>등록한 유저 : {data.user_id}</span>
        <span>코스길이 : {data.distance}</span>
      </div>
      <div>
        <span>코스 설명 : {data.content}</span>
        <div className='flex gap-4'>
          <img className='h-[200px]'src={data.thumbnail_id}></img>
          <span className='my-auto text-xl font-bold'>코스이미지 입니다.</span>
        </div>
      </div>
      <div>
        <button className='border border-gray-400 rounded-md p-1'
        onClick={() => func(data.waypoint, data.center, data.level)}>코스 보기</button>
      </div>
    </div>
  )
}

export default CourseData