"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import React from "react";
import Image from "next/image";
import { getImagePrefix } from "@/utils/util";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const { cart, addToCart } = useCart();
    const totalCols = 4;

    // Fetch all courses
    useEffect(() => {
        apiGet("/course/")
            .then(setCourses)
            .catch((err) => console.error("Error fetching courses:", err));
    }, []);

    // To maintain 4-column grid alignment
    const paddedCourses = [
        ...courses,
        ...Array((totalCols - (courses.length % totalCols)) % totalCols).fill(null),
    ];

    // Limit visible courses
    const visibleCourses = showAll ? paddedCourses : paddedCourses.slice(0, 8);

    // Check if course is already in cart
    const isInCart = (courseId) => cart.some((item) => item.course?.id === courseId);

    const handleAddToCart = async (course) => {
        try {
            const result = await addToCart(course);
            if (result.ok) {
                toast.success(`${course.title} added to cart`);
            } else {
                toast.info(`${course.title} is already in your cart`);
            }
        } catch (err) {
            toast.error("Could not add to cart");
            console.error(err);
        }
    };

    return (
        <section id="courses">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className="sm:flex justify-between items-center mb-12">
                    <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">
                        Popular courses.
                    </h2>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-primary text-lg font-medium hover:tracking-widest duration-500"
                    >
                        {showAll ? "Show less" : "Explore courses →"}
                    </button>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {visibleCourses.map((course, index) =>
                        course ? (
                            <div key={index}>
                                <div className="bg-white m-3 mb-6 px-3 pt-3 pb-4 shadow-course-shadow rounded-2xl h-full">
                                    <div className="relative rounded-3xl">
                                        <Image
                                            src={
                                                course.image.startsWith("http")
                                                    ? course.image
                                                    : `${getImagePrefix()}${course.image}`
                                            }
                                            alt={course.title}
                                            width={389}
                                            height={262}
                                            className="rounded-2xl"
                                        />
                                    </div>

                                    <div className="px-3 pt-6">
                                        <h2 className="cursor-pointer hover:text-primary text-2xl font-bold text-black inline-block">
                                            {course.title}
                                        </h2>
                                        <h3 className="text-base font-normal pt-6 text-black/75">
                                            {course.faculty}
                                        </h3>

                                        <div className="flex justify-between items-center py-6 border-b">
                                            {/* Desktop Button */}
                                            <button
                                                onClick={() => handleAddToCart(course)}
                                                disabled={isInCart(course.id)}
                                                className={`block px-8 py-3 rounded-full text-lg font-medium transition-all duration-300
      ${isInCart(course.id)
                                                        ? "bg-primary text-white hover:bg-primary/15 cursor-not-allowed"
                                                        : "bg-primary text-white hover:bg-primary/15 hover:text-primary"
                                                    }`}
                                            >
                                                {isInCart(course.id) ? "Added" : "Add to Cart"}
                                            </button>

                                            {/* Mobile Button */}
                                            <div className="lg:hidden w-full">
                                                <button
                                                    onClick={() => handleAddToCart(course)}
                                                    disabled={isInCart(course.id)}
                                                    className={`w-full px-4 py-2 rounded-full text-white font-medium transition-all duration-300
        ${isInCart(course.id)
                                                            ? "bg-primary text-white hover:bg-primary/15 cursor-not-allowed"
                                                            : "bg-primary hover:bg-primary/15 text-white:hover:text-primary"
                                                        }`}
                                                >
                                                    {isInCart(course.id) ? "Added" : "Add to Cart"}
                                                </button>
                                            </div>

                                            <h3 className="text-3xl font-medium">₹{course.price}</h3>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={index} className="bg-transparent"></div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default Courses;
