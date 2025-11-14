import React, { useState } from 'react';

function GalleryCarousel({ images }) {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);

  if (!images || images.length === 0) {
    return <p>Không có hình ảnh sản phẩm.</p>;
  }

  return (
    <div className="gallery-carousel">

      <div className="thumbnail-row">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`detail-thumbnail ${selectedImage === img ? 'active' : ''}`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </div>
  );
}

export default GalleryCarousel;