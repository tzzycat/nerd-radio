'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var data = {},
    displayMode = 'card',
    entryFilter = void 0,
    newSongTitle = void 0,
    newSongArtist = void 0,
    newSongVid = void 0,
    newSongUserSelect = void 0,
    editSongTitle = void 0,
    editSongArtist = void 0,
    editSongVid = void 0;

/**
 * Components related
 */
function render(callback) {
  ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
  if (callback) callback();
}

function App() {
  return React.createElement(
    'div',
    null,
    React.createElement(Sidebar, null),
    React.createElement(Main, null),
    React.createElement(AddDialog, null),
    React.createElement(EditDialog, null)
  );
}

/* [Component] Sidebar */
function Sidebar(props) {
  return React.createElement(
    'div',
    { id: 'sidebar' },
    React.createElement(Navigation, null),
    React.createElement(UserList, null),
    React.createElement(GitHubLink, null)
  );
}

function Navigation(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(NavigationButton, { text: 'Home', icon: 'home', action: 'loadAllEntries' }),
    React.createElement(NavigationButton, { text: 'Add New Song', icon: 'plus', action: 'showAddDialog' }),
    React.createElement(NavigationButton, { text: 'Shuffle', icon: 'play', action: 'shuffle' })
  );
}

function NavigationButton(props) {
  function handleClick(e) {
    switch (props.action) {
      case 'loadAllEntries':
        loadData('entries', 'all', function () {
          render(function () {
            resetActiveButtons();
            scrollToTop();
          });
        });
        break;
      case 'showAddDialog':
        document.getElementById('add-dialog').style.display = 'flex';
        break;
      case 'shuffle':
        var i = Math.floor(Math.random() * data.entries.length),
            vid = data.entries[i].vid;
        setYouTubePlayerSrc(vid, true);
        break;
    }
  }

  return React.createElement(
    'button',
    { onClick: handleClick },
    React.createElement('i', { className: 'fa fa-lg fa-' + props.icon }),
    React.createElement(
      'span',
      null,
      props.text
    )
  );
}

function UserList(props) {
  var listItems = data.users.map(function (user) {
    return React.createElement(Avatar, { key: user.id, user: user });
  });
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h3',
      null,
      'Users'
    ),
    React.createElement(
      'div',
      null,
      listItems
    )
  );
}

function Avatar(props) {
  function filtByUserId(e) {
    loadData('entries', props.user.id, function () {
      render(function () {
        resetActiveButtons();
        $('#avatar-' + props.user.id).addClass('active');
        scrollToTop();
      });
    });
  }

  return React.createElement(
    'button',
    { id: 'avatar-' + props.user.id, onClick: filtByUserId },
    React.createElement('img', { src: 'img/avatars/' + props.user.avatarUrl }),
    React.createElement(
      'span',
      null,
      '(',
      props.user.numOfSongs,
      ') ',
      props.user.name
    )
  );
}

function GitHubLink(props) {
  return React.createElement(
    'div',
    { id: 'gitHubLink' },
    React.createElement(
      'a',
      { href: 'https://github.com/tzzycat/nerd-radio', target: '_blank' },
      React.createElement('i', { className: 'fa fa-github' }),
      React.createElement(
        'span',
        null,
        'GitHub'
      )
    )
  );
}

/* [Component] Main */
function Main(props) {
  var heading = entryFilter && entryFilter !== 'all' ? 'Nerd Radio: ' + data.users[entryFilter].name : 'Nerd Radio';
  return React.createElement(
    'div',
    { id: 'main' },
    React.createElement(
      'h1',
      null,
      heading
    ),
    React.createElement(
      'div',
      { id: 'main-content' },
      React.createElement(YouTubePlayer, null),
      React.createElement(DisplayModeSwitch, null),
      React.createElement(EntryContainer, null)
    )
  );
}

function YouTubePlayer(props) {
  return React.createElement(
    'div',
    { id: 'youtube-player-wrapper' },
    React.createElement('iframe', { id: 'youtube-player-frame',
      width: '560', height: '315',
      frameBorder: '0',
      allowFullScreen: 'allowfullscreen'
    })
  );
}

function DisplayModeSwitch(props) {
  return React.createElement(
    'div',
    { id: 'display-mode-switch' },
    React.createElement(DisplayModeSwitchButton, { icon: 'th-large', mode: 'card', checked: 'true' }),
    React.createElement(DisplayModeSwitchButton, { icon: 'th', mode: 'card-small' }),
    React.createElement(DisplayModeSwitchButton, { icon: 'list', mode: 'list' })
  );
}

function DisplayModeSwitchButton(props) {
  function handleClick(e) {
    displayMode = props.mode;
    render();
  }

  var checked = props.checked ? true : false;
  return React.createElement(
    'div',
    null,
    React.createElement('input', { type: 'radio',
      name: 'display-mode',
      id: 'display-mode-' + props.mode,
      defaultChecked: checked
    }),
    React.createElement(
      'label',
      {
        htmlFor: 'display-mode-' + props.mode,
        onClick: handleClick },
      React.createElement('i', { className: 'fa fa-' + props.icon })
    )
  );
}

function EntryContainer(props) {
  if (displayMode === 'card' || displayMode === 'card-small') {
    return React.createElement(
      'div',
      { id: 'entry-container' },
      React.createElement(CardContainer, null)
    );
  } else if (displayMode === 'list') {
    return React.createElement(
      'div',
      { id: 'entry-container' },
      React.createElement(ListContainer, null)
    );
  } else return false;
}

function CardContainer(props) {
  var entries = data.entries.slice(0).reverse().map(function (entry) {
    return React.createElement(Card, { key: entry.id, data: entry });
  });
  return React.createElement(
    'div',
    null,
    entries
  );
}

function Card(props) {
  function playYouTube(e) {
    setYouTubePlayerSrc(props.data.vid, true);
  }

  if (props.data.userId !== -1) {
    var className = displayMode === 'card' ? 'card' : 'card card-small';
    return React.createElement(
      'div',
      { className: className },
      React.createElement('img', { src: 'https://img.youtube.com/vi/' + props.data.vid + '/0.jpg', onClick: playYouTube }),
      React.createElement(CardDescription, { data: props.data })
    );
  }
  return false;
}

function CardDescription(props) {
  return React.createElement(
    'div',
    { className: 'description' },
    React.createElement(
      'div',
      { className: 'entry-title' },
      props.data.title
    ),
    React.createElement(
      'div',
      { className: 'entry-artist' },
      props.data.artist
    ),
    React.createElement(
      'div',
      { className: 'entry-info' },
      props.data.date,
      ' ',
      data.users[props.data.userId].name
    ),
    React.createElement(EditIcon, { data: props.data })
  );
}

function EditIcon(props) {
  function showEditDialog(e) {
    e.preventDefault();
    editSongTitle.value = props.data.title;
    editSongArtist.value = props.data.artist;
    editSongVid.value = props.data.vid;
    document.getElementById('id-hidden').value = props.data.id;
    document.getElementById('uid-hidden').value = props.data.userId;
    document.getElementById('edit-dialog').style.display = 'flex';
  }

  return React.createElement(
    'a',
    { href: '#', className: 'edit-icon', onClick: showEditDialog },
    React.createElement('i', { className: 'fa fa-pencil' })
  );
}

function ListContainer(props) {
  var entries = data.entries.slice(0).reverse().map(function (entry) {
    return React.createElement(ListItem, { key: entry.id, data: entry });
  });
  return React.createElement(
    'div',
    { id: 'list-container' },
    React.createElement(
      'table',
      null,
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Title'
          ),
          React.createElement(
            'th',
            null,
            'Artist'
          ),
          React.createElement(
            'th',
            null,
            'Shared By'
          ),
          React.createElement('th', null),
          React.createElement('th', null)
        )
      ),
      React.createElement(
        'tbody',
        null,
        entries
      )
    )
  );
  return false;
}

function ListItem(props) {
  function showEditDialog(e) {
    e.preventDefault();
    editSongTitle.value = props.data.title;
    editSongArtist.value = props.data.artist;
    editSongVid.value = props.data.vid;
    document.getElementById('id-hidden').value = props.data.id;
    document.getElementById('uid-hidden').value = props.data.userId;
    document.getElementById('edit-dialog').style.display = 'flex';
  }

  function playYouTube(e) {
    e.preventDefault();
    setYouTubePlayerSrc(props.data.vid, true);
  }

  if (props.data.userId !== -1) {
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        null,
        props.data.title
      ),
      React.createElement(
        'td',
        null,
        props.data.artist
      ),
      React.createElement(
        'td',
        null,
        data.users[props.data.userId].name
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: '#', onClick: showEditDialog },
          React.createElement('i', { className: 'fa fa-pencil' })
        )
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: '#', onClick: playYouTube },
          React.createElement('i', { className: 'fa fa-play' })
        )
      )
    );
  }
  return false;
}

/**
 * Dialog for adding a new song
 */
function AddDialog(props) {
  return React.createElement(
    'div',
    { id: 'add-dialog' },
    React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        'Add New Song'
      ),
      React.createElement(AddDialogContent, null),
      React.createElement(AddDialogButtonContainer, null)
    )
  );
}

function AddDialogContent(props) {
  return React.createElement(
    'div',
    { id: 'add-dialog-content' },
    React.createElement(
      'table',
      null,
      React.createElement(
        'tbody',
        null,
        React.createElement(DialogRow, { text: 'Song', inputId: 'new-song-title', inputPlaceholder: '\u9EBB\u5409' }),
        React.createElement(DialogRow, { text: 'Artist', inputId: 'new-song-artist', inputPlaceholder: 'Machi' }),
        React.createElement(DialogRow, { text: 'YouTube', inputId: 'new-song-vid', inputPlaceholder: 'https://www.youtube.com/watch?v=XY0Jrbn0Ebo' }),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            'User'
          ),
          React.createElement(
            'td',
            null,
            React.createElement(AddDialogUserSelect, null)
          )
        )
      )
    )
  );
}

function AddDialogUserSelect(props) {
  var options = data.users.map(function (user) {
    return React.createElement(
      'option',
      { key: user.id, value: user.id },
      user.name
    );
  });
  return React.createElement(
    'div',
    { className: 'select-wrapper' },
    React.createElement(
      'select',
      { id: 'new-song-user-select' },
      React.createElement(
        'option',
        { value: '' },
        'Please select'
      ),
      options
    )
  );
}

function AddDialogButtonContainer(props) {
  function cancel(e) {
    document.getElementById('add-dialog').style.display = 'none';
    resetInputs([newSongTitle, newSongArtist, newSongVid, newSongUserSelect]);
  }

  function addConfirm(e) {
    if (!isInputsValid([newSongTitle, newSongArtist, newSongVid, newSongUserSelect])) {
      alert('Please fill in all inputs!');
      return;
    }

    var date = new Date(),
        vid = newSongVid.value.split('v=')[1];

    // Parse YouTube URL
    if (!vid) {
      alert('Wrong format of YouTube URL!');
      return;
    }
    var youtubeAmpersandPos = vid.indexOf('&');
    if (youtubeAmpersandPos !== -1) vid = vid.substring(0, youtubeAmpersandPos);

    var data = {
      date: date.getMonth() + 1 + '/' + date.getDate(),
      title: newSongTitle.value,
      artist: newSongArtist.value,
      vid: vid,
      userId: newSongUserSelect.value
    };

    sendRequest('add', data, function () {
      loadData('users', null, render);
      loadData('entries', 'all', render);
    });
    document.getElementById('add-dialog').style.display = 'none';
    resetActiveButtons();
    resetInputs([newSongTitle, newSongArtist, newSongVid, newSongUserSelect]);
  }

  return React.createElement(
    'div',
    { id: 'add-dialog-btn-container' },
    React.createElement(
      'button',
      { onClick: cancel },
      'Cancel'
    ),
    React.createElement(
      'button',
      { onClick: addConfirm },
      'Confirm'
    )
  );
}

/**
 * Dialog for editing an entry
 */
function EditDialog(props) {
  return React.createElement(
    'div',
    { id: 'edit-dialog' },
    React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        'Edit'
      ),
      React.createElement(EditDialogContent, null),
      React.createElement(EditDialogButtonContainer, null)
    )
  );
}

function EditDialogContent(props) {
  return React.createElement(
    'div',
    { id: 'edit-dialog-content' },
    React.createElement(
      'table',
      null,
      React.createElement(
        'tbody',
        null,
        React.createElement(DialogRow, { text: 'Song', inputId: 'edit-song-title' }),
        React.createElement(DialogRow, { text: 'Artist', inputId: 'edit-song-artist' }),
        React.createElement(DialogRow, { text: 'YouTube Video ID', inputId: 'edit-song-vid' })
      )
    ),
    React.createElement('input', { type: 'hidden', id: 'id-hidden' }),
    React.createElement('input', { type: 'hidden', id: 'uid-hidden' })
  );
}

function EditDialogButtonContainer(props) {
  function deleteEntry() {
    if (confirm('Are you sure to delete this entry?')) {
      var payload = {
        id: document.getElementById('id-hidden').value,
        userId: document.getElementById('uid-hidden').value
      };
      sendRequest('delete', payload, function () {
        loadData('users', null, render);
        loadData('entries', 'all', function () {
          render();
          var latestEntry = data.entries.slice(0).reverse()[0];
          setYouTubePlayerSrc(latestEntry.vid, false);
        });
      });
      document.getElementById('edit-dialog').style.display = 'none';
      resetActiveButtons();
    }
  }

  function cancel() {
    document.getElementById('edit-dialog').style.display = 'none';
  }

  function editConfirm() {
    if (!isInputsValid([editSongTitle, editSongArtist, editSongVid])) {
      alert('Please fill in all inputs!');
      return;
    }

    var data = {
      id: document.getElementById('id-hidden').value,
      title: editSongTitle.value,
      artist: editSongArtist.value,
      vid: editSongVid.value
    };

    sendRequest('edit', data, function () {
      loadData('entries', 'all', function () {
        render();
        var latestEntry = data.entries.slice(0).reverse()[0];
        setYouTubePlayerSrc(latestEntry.vid, false);
      });
    });
    document.getElementById('edit-dialog').style.display = 'none';
    resetActiveButtons();
  }

  return React.createElement(
    'div',
    { id: 'edit-dialog-btn-container' },
    React.createElement(
      'table',
      null,
      React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            React.createElement(
              'button',
              { onClick: deleteEntry },
              'Delete'
            )
          ),
          React.createElement(
            'td',
            null,
            React.createElement(
              'button',
              { onClick: cancel },
              'Cancel'
            ),
            React.createElement(
              'button',
              { onClick: editConfirm },
              'Confirm'
            )
          )
        )
      )
    )
  );
}

function DialogRow(props) {
  return React.createElement(
    'tr',
    null,
    React.createElement(
      'td',
      null,
      props.text
    ),
    React.createElement(
      'td',
      null,
      React.createElement('input', { type: 'text',
        id: props.inputId,
        placeholder: props.inputPlaceholder })
    )
  );
}

/**
 * Functions related to backend
 */
function sendRequest(action, payload, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (callback) callback(xhr.responseText);
    }
  };
  xhr.open('POST', './php/' + action + '.php', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  if ((typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) === 'object') xhr.send(JSON.stringify(payload));else // `payload` is in type of string.
    xhr.send(payload);
}

function loadData(type, filter, callback) {
  sendRequest('load', {
    type: type,
    filter: filter
  }, function (response) {
    data[type] = JSON.parse(response);
    if (type === 'entries') entryFilter = filter;
    if (callback) callback();
  });
}

/**
 * Other functions
 */
function setYouTubePlayerSrc(vid, autoPlay) {
  var src = 'https://www.youtube.com/embed/' + vid;
  if (autoPlay) src += '?autoplay=1';
  document.getElementById('youtube-player-frame').src = src;
}

function resetActiveButtons() {
  $('#sidebar button').each(function () {
    $(this).removeClass('active');
  });
}

function scrollToTop() {
  var body = $('body');
  body.stop().animate({ scrollTop: 0 }, '1000', 'swing');
}

function resetInputs(inputList) {
  for (var i = 0; i < inputList.length; i++) {
    var input = inputList[i],
        type = input.type;
    if (type === 'text') input.value = '';else if (type === 'select-one') input.selectedIndex = 0;
  }
}

function isInputsValid(inputList) {
  for (var i = 0; i < inputList.length; i++) {
    var input = inputList[i];
    if (input.value === '') return false;
  }
  return true;
}

/**
 * Initialize
 */
(function init() {
  var loadedDataCount = 0;
  loadData('users', null, loadDataSucceed);
  loadData('entries', 'all', loadDataSucceed);

  function loadDataSucceed() {
    loadedDataCount++;
    if (loadedDataCount === 2) {
      render(function () {
        var latestEntry = data.entries.slice(0).reverse()[0];
        setYouTubePlayerSrc(latestEntry.vid, false);
        newSongTitle = document.getElementById('new-song-title');
        newSongArtist = document.getElementById('new-song-artist');
        newSongVid = document.getElementById('new-song-vid');
        newSongUserSelect = document.getElementById('new-song-user-select');
        editSongTitle = document.getElementById('edit-song-title');
        editSongArtist = document.getElementById('edit-song-artist');
        editSongVid = document.getElementById('edit-song-vid');
      });
    }
  }
})();