// ImageUploader.jsx
import React, { useEffect, useState } from 'react';

function ImageLoader({updateFormImage, initialImg}) {
  const [imageBase64, setImageBase64] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (initialImg) {
        setImageBase64(initialImg)
    }
  })
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
        setImageBase64(reader.result)
        updateFormImage(imageBase64)
    }
      

    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("File is too big")
        }
        else
            reader.readAsDataURL(file)
    }
  }

  return (
    <>
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {imageBase64 && (
        <div>
          <div>
            <img
              src={imageBase64}
              alt="Uploaded"
              className="image-preview"
            />
          </div>
          <div className="error-message">{errorMessage}</div>
        </div>
      )}
    </div>
    </>
  );
}

export default ImageLoader
