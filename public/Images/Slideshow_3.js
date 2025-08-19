// src/Components/SlideShow/Slideshow_3.js
import React from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';

// Import required modules
import { EffectCards, Autoplay } from 'swiper/modules';

// Import images
import image_9 from '../Images/image_9.png'; // Adjust path as needed
import image_10 from '..Images/image_10.png';
import image_11 from '../Images/image_11.png';

// Import custom CSS for container styling
import './Slideshow_3.css';

function Slideshow_3() {
  return (
    <div className="slideshow-3">
      <Swiper
        direction="vertical" 
        effect="cards"
        cardsEffect={{
          perSlideOffset: 14,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[EffectCards, Autoplay]}
        className="mySwiper"
        loop={true}
      >
        <SwiperSlide>
          <img src={image_9} alt="Slide 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image_10} alt="Slide 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image_11} alt="Slide 3" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Slideshow_3;