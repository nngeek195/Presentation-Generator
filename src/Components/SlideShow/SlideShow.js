import React from 'react'
import 'swiper/css';
import 'swiper/css/effect-cards';
import {Swiper, SwiperSlide} from 'swiper/react';
import {EffectCards, Autoplay} from 'swiper/modules';
import './SlideShow.css'
import image_1 from './Images/image_1.png'
import image_2 from './Images/image_2.png'
import image_3 from './Images/image_3.jpg'


function SlideShow() {
  return (
    <div className='slideshow'>
        <Swiper
          effect={'cards'}
          modules={[EffectCards, Autoplay]}
          autoplay={{
            delay: 2000,       
            disableOnInteraction: false,
          }}
          className='mySwiper'
        >
            <SwiperSlide><img src={image_1} alt='Slide_1'/></SwiperSlide>
            <SwiperSlide><img src={image_2} alt='Slide_2'/></SwiperSlide>
            <SwiperSlide><img src={image_3} alt='Slide_3'/></SwiperSlide>
        </Swiper>
    </div>
  )
}

export default SlideShow