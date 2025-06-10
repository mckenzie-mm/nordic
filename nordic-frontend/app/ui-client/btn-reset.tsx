'use client'
 
import { useState } from 'react';
import { reset } from '../actions/admin'
 
export default function BtnReset() {

  const [showLoading, setShowLoading] = useState(false);

  return (
      <button
      className='admin-reset-btn'
        onClick={async () => {
          setShowLoading(true)
          const timer = setTimeout(() => {
              setShowLoading(false);
            }, 1500);
          await reset()
        }}
      >
        {showLoading ? "...Loading" : "Reset"}
      </button>
  )
}

