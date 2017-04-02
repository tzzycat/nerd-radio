/**
 * Dependencies: jQuery, corresponding CSS file (notify.css)
 */
let notifyContainer = document.getElementById('notify-container'),
    notifyHideDelay = 5;  // seconds

function notify(content) {
  let notifyElement = document.createElement('div');
  notifyElement.className = 'notify-entry';
  notifyElement.innerHTML = content;

  notifyContainer.appendChild(notifyElement);

  $(notifyElement).delay(notifyHideDelay * 1000).fadeOut(function() {
    this.parentNode.removeChild(this);
  });
}
