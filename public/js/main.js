window.onload = () => {
    'use strict';
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('./serviceworker.js');
    }

    var status = document.getElementById("status");
  
    function updateOnlineStatus(event) {
      var condition = navigator.onLine ? "online" : "offline";
  
      status.className = condition;
      status.innerHTML = condition.toUpperCase();
    }
  
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

  }