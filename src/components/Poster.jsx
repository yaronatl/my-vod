import React, { useEffect, useState } from 'react'
import { valueOrNull } from '../services/omdb'

export default function Poster({ src, title, large = false }) {
  const [failed, setFailed] = useState(false);
  const url = valueOrNull(src);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const box = large ? 'poster-box-large' : 'poster-box';
  return (
    <div className={box}>
      {url && !failed ? (
        <img src={url} alt={`${title} poster`} className='poster-img' onError={() => setFailed(true)} />
      ) : (
        <div className='poster-placeholder'>No poster</div>
      )}
    </div>
  )
}
