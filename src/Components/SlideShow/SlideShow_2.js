import React from 'react'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import {Swiper, SwiperSlide} from 'swiper/react';
import {EffectCoverflow, Autoplay} from 'swiper/modules';
import './SlideShow_2.css'
import image_4 from './Images/image_4.png'
import image_5 from './Images/image_5.png'
import image_6 from './Images/image_6.png'
import image_7 from './Images/image_7.png'
import image_8 from './Images/image_8.png'


function SlideShow() {
  return (
    <div className='slideshow_2'>
        <Swiper
          effect={'coverflow'}
          centeredSlides={true}
          slidesPerView={3}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
  }}
          modules={[EffectCoverflow, Autoplay]}
          autoplay={{
            delay: 2000,       
            disableOnInteraction: false,
          }}
          className='mySwiper_2'
        >
            <SwiperSlide><img src={image_4} alt='Slide_4'/></SwiperSlide>
            <SwiperSlide><img src={image_5} alt='Slide_5'/></SwiperSlide>
            <SwiperSlide><img src={image_6} alt='Slide_6'/></SwiperSlide>
            <SwiperSlide><img src={image_7} alt='Slide_7'/></SwiperSlide>
            <SwiperSlide><img src={image_8} alt='Slide_8'/></SwiperSlide>
        </Swiper>
    </div>
  )
}

export default SlideShow