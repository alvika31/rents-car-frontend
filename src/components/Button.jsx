import React from 'react'
import { IconDashboard } from '@tabler/icons-react';
function Button(props) {
  const {icon, text, color, onClick} = props
  
  return (
    <div>
       <button onClick={onClick} className={`border text-slate-600 inline-flex gap-2 font-semibold border-gray-200 px-2 py-2 rounded-md transition ease-in-out delay-100 hover:bg-${color}-500 hover:text-white`}>{icon} {text}</button>
    </div>
  )
}

export default Button