// ImageUploader.jsx
import React, { useEffect, useState } from 'react';
import '../Styles/ImageLoader.css'

function ImageLoader({updateFormImage, initialImg}) {
  const [imageBase64, setImageBase64] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (initialImg) {
        setImageBase64(initialImg)
    }
  }, [initialImg])
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
        setImageBase64(reader.result)
        updateFormImage(reader.result)
        setErrorMessage("")
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
    <div className="image-uploader">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {imageBase64 && (
        <div>
          {errorMessage=="" &&
          <div className="image-container">
            <img
              src={imageBase64}
              alt="Uploaded"
              className="image-preview"
            />
          </div>
          }
        </div>
      )}
      <div className="error-message">{errorMessage}</div>
          </div>
    </>
  );
}

export default ImageLoader
