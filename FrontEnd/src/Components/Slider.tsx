import * as React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import video1 from '../assets/video1.jpeg';
import video2 from '../assets/video2.jpeg';
import video3 from '../assets/video3.jpeg';
import video4 from '../assets/video4.jpeg';
import video5 from '../assets/video5.jpeg';
import video6 from '../assets/video6.jpeg';
import video7 from '../assets/video7.jpeg';
import video8 from '../assets/video8.jpeg';


const content = [
  {
    img: video1,
    date: '26 December 2018',
    header: 'Title01',
    info: 'Absolutely fantastic experience! The instructors at 360 Drive Academy are incredibly patient and knowledgeable. I was super nervous when I started, but they helped me build confidence with every lesson. Passed my test on the first try! Highly recommend to anyone looking to learn in a stress-free environment',
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
    info: 'I couldn’t be happier with my decision to join 360 Drive Academy. My instructor was always on time, super friendly, and gave clear, easy-to-follow instructions. They made parallel parking (my biggest fear) feel so simple! Now I feel safe and confident on the road. Thank you so much!'
  },
  {
    img: video4,
    date: '26 December 2012',
    header: 'Title04',
    info: 'I am very grateful for your help and support. I was super worried on the road and very nervous.  I love your way of your teaching and show me reference points has helped me with my driving. I have passed first time at Mill Hill test centre. Thank you for all of your help.'
  },
  {
    img: video5,
    date: '26 December 2013',
    header: 'Title05',
    info: 'I successfully passed my driving test on the first try at Pinner in under 10 hours of lessons. I had a negative experience with another driving school before, so I was thrilled when I found 360 School. The instructor was really friendly, and my father felt confident in moving forward because of the knowledge and skills I gained. Thank you!',
  },
  {
    img: video6,
    date: '26 December 2014',
    header: 'Title06',
    info: 'Great school with amazing instructors! They tailored my lessons to fit my schedule, which was really helpful. I especially appreciated how they focused on real-world scenarios to prepare me for my driving test. Only reason I gave 4.5 stars is I wish I’d started lessons with them sooner. Don’t wait like I did!',
  },
  {
    img: video7,
    date: '26 December 2015',
    header: 'Title07',
    info: 'Thank you. I highly recommend 360 driving school.passed with confidence'
  },
  {
    img: video8,
    date: '26 December 2016',
    header: 'Title08',
    info: 'I have passed at Pinner. I was super worried at all the time. thank you so much for showing me the diagrams which has helped a lot. I really enjoyed  the mock test was very helpful and encourage others to go with you guys.',
  }

];

export default function Fade() {
  return (
    <section className="pt-10 pb-8 mt-20">
      <div className="lg:mx-auto max-w-5xl mx-6">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-8 text-center mobile:text-3xl">
            Our Success Gallery
          </h1>
        </div>

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
                    className="h-[24rem] mobile:h-[28rem] w-[24rem] rounded-lg"
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
                <div className="title">

                  <p className="mt-10 font-italic text-xl mobile:text-sm font-bold">{item.info}</p>
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
