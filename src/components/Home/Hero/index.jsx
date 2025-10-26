"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Image from 'next/image';
import { Icon } from "@iconify/react/dist/iconify.js";
import { getImagePrefix } from '@/utils/util';

const Hero = () => {
      const [slider, setSlider] = useState([]);
    
      useEffect(() => {
        apiGet("/slider/")
          .then((data) => {
      console.log("Slider data:", data);
      setSlider(data);
    })
          .catch(console.error);
      }, []);
      
    return (
        <section id="home-section" className='bg-slateGray'>
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
                {slider.map((items, i) => (
                <div key={items.id} className='grid grid-cols-1 lg:grid-cols-12 space-x-1 items-center'>
                    <div className='col-span-6 flex flex-col gap-8 '>
                        <div className='flex gap-2 mx-auto lg:mx-0'>
                            <Icon
                                icon="solar:verified-check-bold"
                                className="text-success text-xl inline-block me-2"
                            />
                            <p className='text-success text-sm font-semibold text-center lg:text-start'>Get 30% off on first enroll</p>
                        </div>
                        <h1 className='text-midnight_text text-4xl sm:text-5xl font-semibold pt-5 lg:pt-0'>{items.title}</h1>
                        <h3 className='text-black/70 text-lg pt-5 lg:pt-0'>{items.description}</h3>
                        <div className="relative rounded-full pt-5 lg:pt-0">
                            <input type="Email address" name="q" className="py-6 lg:py-8 pl-8 pr-20 text-lg w-full text-black rounded-full focus:outline-none shadow-input-shadow" placeholder="search courses..." autoComplete="off" />
                            <button className="bg-secondary p-5 rounded-full absolute right-2 top-2 ">
                                <Icon
                                    icon="solar:magnifer-linear"
                                    className="text-white text-4xl inline-block"
                                />
                            </button>
                        </div>
                        <div className='flex items-center justify-between pt-10 lg:pt-4'>
                        </div>
                        
                    </div>
                    <div className='col-span-6 flex justify-center'>
                        <Image
  src={items.image.startsWith("http") ? items.image : `${getImagePrefix()}${items.image}`}
  alt="nothing"
  width={1000}
  height={805}
/>
                    </div>
                </div>
                ))}

            </div>
        </section >
    )
}

export default Hero;
