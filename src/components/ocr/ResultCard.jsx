import React from 'react'

function ResultCard({ data, index }) {
  const formatExampleText = (text) => {
    if (!text) return ''
    
    return text.split(/(<strong>.*?<\/strong>)/g).map((part, i) => {
      if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        const content = part.replace('<strong>', '').replace('</strong>', '')
        return <strong key={i}>{content}</strong>
      }
      return part
    })
  }

  return (
    <div className="result-card">
      <div className="card-header">
        <span className="card-number">#{index + 1}</span>
        <h3 className="word-title">{data.word || '（単語なし）'}</h3>
      </div>
      
      <div className="card-body">
        {data.core && (
          <div className="core-section">
            <span className="label">コア:</span>
            <span className="core-text">{data.core}</span>
          </div>
        )}
        
        {data.translation && data.translation.length > 0 && (
          <div className="translation-section">
            <span className="label">現代語訳:</span>
            <div className="translation-list">
              {data.translation.map((trans, i) => (
                <span key={i} className="translation-item">{trans}</span>
              ))}
            </div>
          </div>
        )}
        
        {data.example && (
          <div className="example-section">
            <span className="label">例文:</span>
            <p className="example-text">
              {formatExampleText(data.example)}
            </p>
          </div>
        )}
        
        {data.example_bold && data.example_bold.length > 0 && (
          <div className="bold-words-section">
            <span className="label">該当語:</span>
            <div className="bold-words-list">
              {data.example_bold.map((word, i) => (
                <span key={i} className="bold-word-chip">{word}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultCard
