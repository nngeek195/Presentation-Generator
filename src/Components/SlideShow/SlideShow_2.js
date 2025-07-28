import React from 'react'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import {Swiper, SwiperSlide} from 'swiper/react';
import {EffectCoverflow, Autoplay} from 'swiper/modules';
import './SlideShow_2.css'
import image_1 from './Images/image_1.jpg'
import image_2 from './Images/image_2.jpg'
import image_3 from './Images/image_3.jpg'


function SlideShow() {
  return (
    <div className='slideshow_2'>
        <Swiper
          effect={'coverflow'}
          modules={[EffectCoverflow, Autoplay]}
          autoplay={{
            delay: 2000,       
            disableOnInteraction: false,
          }}
          className='mySwiper_2'
        >
            <SwiperSlide><img src={image_1} alt='Slide_1'/></SwiperSlide>
            <SwiperSlide><img src={image_2} alt='Slide_2'/></SwiperSlide>
            <SwiperSlide><img src={image_3} alt='Slide_3'/></SwiperSlide>
        </Swiper>
    </div>
  )
}

export default SlideShow