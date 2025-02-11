import React from 'react';

function BackgroundImage({ imageUrl, imageUrlSmall, gradientFrom, gradientTo, altName, fotoCredit }) {
    return (
        <>
            <img
                src={imageUrlSmall}
                className="absolute brightness-90 inset-0 object-cover h-full w-full z-[-3]"
                srcSet={`${imageUrlSmall} 1x, ${imageUrl} 2x`}
                alt={`Background Image of ${altName}`}
                loading="eager"
                fetchpriority="high"
            />
            <div
                className={`fixed inset-0 z-[-2] bg-gradient-to-r from-${gradientFrom}/10 to-${gradientTo}/10 mix-blend-overlay`}
            />
            <div className="absolute bottom-0 left-0 py-2 px-10 text-gray-700 text-xs z-10">
                Foto: {fotoCredit}
            </div>
        </>
    );
}

export default BackgroundImage;