import * as React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import video1 from '../assets/1.png';
import video2 from '../assets/2.png';
import video3 from '../assets/3.png';

const content = [
  {
    img: video1,
    date: '26 December 2018',
    header: 'Title01',
    info: 'Absolutely fantastic experience! The instructors at 360 Driving School are incredibly patient and knowledgeable. I was super nervous when I started, but they helped me build confidence with every lesson. Passed my test on the first try! Highly recommend to anyone looking to learn in a stress-free environment',
  },
  {
    img: video2,
    date: '26 December 2010',
    header: 'Title02',
    info: 'Great school with amazing instructors! They tailored my lessons to fit my schedule, which was really helpful. I especially appreciated how they focused on real-world scenarios to prepare me for my driving test. Only reason I gave 4.5 stars is I wish I’d started lessons with them sooner. Don’t wait like I did!',
  },
  {
    img: video3,
    date: '26 December 2011',
    header: 'Title03',
    info: 'I couldn’t be happier with my decision to join 360 Driving School. My instructor was always on time, super friendly, and gave clear, easy-to-follow instructions. They made parallel parking (my biggest fear) feel so simple! Now I feel safe and confident on the road. Thank you so much!'
  }];

export default function Fade() {
  return (
    <section className="pt-10 pb-8 mt-20">
      <div className="lg:mx-auto max-w-5xl mx-6">
        <h1 className="text-4xl font-bold  mb-8 text-center mobile:text-2xl">
          Our Success Gallery
        </h1>
        <Swiper
          modules={[Navigation, Pagination, EffectFade]}
          effect="fade"
          loop={true}
          pagination={{
            clickable: true,
            type: 'fraction',
          }}
          spaceBetween={30}
          navigation
          className="fade"
        >
          {content.map((item, index) => (
            <SwiperSlide
              className="grid md:grid-cols-2  md:gap-x-10 md:pt-10"
              key={index}
            >
              <div>
                {item.img ? (
                  <img
                    className="h-[23rem] mobile:h-[28rem] w-[22rem]  rounded-lg"

                    src={item.img}

                    alt={` ${item.header}`}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-100">
                    No Media Available
                  </div>
                )}
              </div>
              <div className="">
                {/* <header className="text-slate-600 font-bold mb-2 invisible">
                  {item.date}
                </header> */}
                <div className="title">
                  <h2 className="font-bold mt-4 text-3xl invisible text-red-500">{item.header}</h2>
                  <p className=" font-italic text-xl  mobile:text-sm">{item.info}</p>
                </div>
                <button className="btn bg-red-600 py-2 px-4 font-bold invisible text-white mt-5">
                  More
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
