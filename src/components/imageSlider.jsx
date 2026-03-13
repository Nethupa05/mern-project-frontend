import { useState } from "react"

export default function ImageSlider({ images = [] }) {

    const [currentIndex, setCurrentIndex] = useState(0)

    return (

        <div className="w-full max-w-[500px] mx-auto">

            {/* Main Image */}
            <div className="w-full flex justify-center">

                <img
                    src={images[currentIndex]}
                    className="w-full max-h-[320px] sm:max-h-[420px] lg:max-h-[500px] object-contain"
                />

            </div>


            {/* Thumbnails */}
            <div className="w-full flex justify-center gap-2 mt-3 overflow-x-auto pb-2">

                {images?.map((image, index) => {

                    const active = index === currentIndex

                    return (

                        <img
                            key={index}
                            src={image}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-[70px] h-[60px] sm:w-[80px] sm:h-[70px] object-contain rounded-lg cursor-pointer border-2 
                            ${active ? "border-accent" : "border-transparent"}
                            hover:border-accent flex-shrink-0`}
                        />

                    )

                })}

            </div>

        </div>
    )
}