"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getImagePrefix } from "@/utils/util";

const Testimonial = () => {
    const [testimonial, setTestimonial] = useState([]);
    
    useEffect(() => {
        apiGet("/testimonial/")
          .then(setTestimonial)
          .catch(console.error);
      }, []);

    const settings = {
        dots: true,
        dotsClass: "slick-dots",
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: false,
        autoplay: true,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

  return (
    <>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Icon key={`full-${i}`} icon="tabler:star-filled" className="text-yellow-500 text-xl inline-block" />
      ))}
      {halfStars > 0 && (
        <Icon key="half" icon="tabler:star-half-filled" className="text-yellow-500 text-xl inline-block" />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Icon key={`empty-${i}`} icon="tabler:star-filled" className="text-gray-400 text-xl inline-block" />
      ))}
    </>
  );
};

    return (
        <section id="testimonial">
            <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4'>
                <Slider {...settings}>
                    {testimonial.map((items, i) => (
                        <div key={i}>
                            <div className={`bg-white rounded-2xl m-4 p-5 my-20 relative ${i % 2 ? 'shadow-testimonial-shadow2' : 'shadow-testimonial-shadow1'}`}>
                                <div className="absolute top-[-45px]">
                                    <Image src={items.image.startsWith("http") ? items.image : `${getImagePrefix()}${items.image}`}
                                        alt={items.name} width={100} height={100} className="inline-block" />
                                </div>
                                <h4 className='text-base font-normal text-darkgray my-4'>{items.feedback}</h4>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className='text-lg font-medium text-darkbrown pt-4 pb-2'>{items.name}</h3>
                                        <h3 className='text-sm font-normal text-lightgray pb-2'>{items.course}</h3>
                                    </div>
                                    <div className="flex">
                                        {renderStars(items.rating)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default Testimonial;
