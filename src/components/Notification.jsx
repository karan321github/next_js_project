import React, { useEffect, useState } from "react";

function Notification({ message, type, duration, onClose }) {
  const [isVisible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if(onClose){
        onClose();
      }
    }, duration);
  }, [duration ,onClose]);

  if(!isVisible){
    return null;
  }
  return (
    <div className="container">
      <p>{message}</p>
      {isVisible && <button onClick={setVisible(false)}>X</button>}
    </div>
  );
}

export default Notification;
