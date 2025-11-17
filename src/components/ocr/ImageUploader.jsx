import React, { useRef, useState } from 'react'

function ImageUploader({ onUpload }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      onUpload(file)
    } else {
      alert('画像ファイルを選択してください')
    }
  }

  const onButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div 
      className={`upload-container ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      <div className="upload-content">
        <svg className="upload-icon" viewBox="0 0 24 24" width="48" height="48">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="none"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
        
        <h3>画像をアップロード</h3>
        <p>ドラッグ＆ドロップ または クリックして選択</p>
        
        <button onClick={onButtonClick} className="upload-button">
          ファイルを選択
        </button>
        
        <p className="upload-hint">
          対応形式: JPG, PNG, GIF, BMP
        </p>
      </div>
    </div>
  )
}

export default ImageUploader
