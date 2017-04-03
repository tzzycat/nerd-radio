/**
 * Dependencies: jQuery, corresponding CSS file (notify.css)
 */
let notifyContainer = document.getElementById('notify-container'),
    notifyHideDelay = 5,  // seconds
    notifyAppend = false;

function notify(content) {
  let notifyElement = document.createElement('div');
  notifyElement.className = 'notify-entry';
  notifyElement.innerHTML = content;

  if (!notifyAppend) {
    while (notifyContainer.lastChild)
      notifyContainer.removeChild(notifyContainer.lastChild);
  }
  notifyContainer.appendChild(notifyElement);

  $(notifyElement).delay(notifyHideDelay * 1000).fadeOut(function() {
    if (this.parentNode)
      this.parentNode.removeChild(this);
  });
}
