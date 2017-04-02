let data = {},
    displayMode = 'card',
    entryFilter,
    newSongTitle, newSongArtist, newSongVid, newSongUserSelect,
    editSongTitle, editSongArtist, editSongVid;

/**
 * Components related
 */
function render(callback) {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  if (callback)
    callback();
}

function App() {
  return (
    <div>
      <Sidebar />
      <Main />
      <AddDialog />
      <EditDialog />
    </div>
  );
}

/* [Component] Sidebar */
function Sidebar(props) {
  return (
    <div id="sidebar">
      <Navigation />
      <UserList />
      <GitHubLink />
    </div>
  );
}

function Navigation(props) {
  return (
    <div>
      <NavigationButton text="Home" icon="home" action="loadAllEntries" />
      <NavigationButton text="Add New Song" icon="plus" action="showAddDialog" />
      <NavigationButton text="Shuffle" icon="play" action="shuffle" />
    </div>
  );
}

function NavigationButton(props) {
  function handleClick(e) {
    switch(props.action) {
      case 'loadAllEntries':
        loadData('entries', 'all', () => {
          render(() => {
            resetActiveButtons();
            scrollToTop();
          })
        });
        break;
      case 'showAddDialog':
        document.getElementById('add-dialog').style.display = 'flex';
        break;
      case 'shuffle':
        let i = Math.floor(Math.random() * data.entries.length);
        setYouTubePlayerSrc(data.entries[i], true);
        break;
    }
  }

  return (
    <button onClick={handleClick}>
      <i className={'fa fa-lg fa-' + props.icon}></i>
      <span>{props.text}</span>
    </button>
  );
}

function UserList(props) {
  const listItems = data.users.map((user) =>
    <Avatar key={user.id} user={user} />
  );
  return (
    <div>
      <h3>Users</h3>
      <div>{listItems}</div>
    </div>
  );
}

function Avatar(props) {
  function filtByUserId(e) {
    loadData('entries', props.user.id, () => {
      render(() => {
        resetActiveButtons();
        $('#avatar-' + props.user.id).addClass('active');
        scrollToTop();
      });
    });
  }

  return (
    <button id={'avatar-' + props.user.id} onClick={filtByUserId}>
      <img src={'img/avatars/' + props.user.avatarUrl} />
      <span>({props.user.numOfSongs}) {props.user.name}</span>
    </button>
  );
}

function GitHubLink(props) {
  return (
    <div id="gitHubLink">
      <a href="https://github.com/tzzycat/nerd-radio" target="_blank">
        <i className="fa fa-github"></i>
        <span>GitHub</span>
      </a>
    </div>
  );
}

/* [Component] Main */
function Main(props) {
  const heading = (entryFilter && entryFilter !== 'all')?
    ('Nerd Radio: ' + data.users[entryFilter].name) : 'Nerd Radio';
  return (
    <div id="main">
      <h1>{heading}</h1>
      <div id="main-content">
        <YouTubePlayer />
        <DisplayModeSwitch />
        <EntryContainer />
      </div>
    </div>
  );
}

function YouTubePlayer(props) {
  return (
    <div id="youtube-player-wrapper">
      <iframe id="youtube-player-frame"
        width="560" height="315"
        frameBorder="0"
        allowFullScreen="allowfullscreen"
      ></iframe>
    </div>
  );
}

function DisplayModeSwitch(props) {
  return (
    <div id="display-mode-switch">
      <DisplayModeSwitchButton icon="th-large" mode="card" checked="true" />
      <DisplayModeSwitchButton icon="th" mode="card-small" />
      <DisplayModeSwitchButton icon="list" mode="list" />
    </div>
  );
}

function DisplayModeSwitchButton(props) {
  function handleClick(e) {
    displayMode = props.mode;
    render();
  }

  const checked = (props.checked)? true : false;
  return (
    <div>
      <input type="radio"
        name="display-mode"
        id={'display-mode-' + props.mode}
        defaultChecked={checked}
         />
      <label
        htmlFor={'display-mode-' + props.mode}
        onClick={handleClick}>
        <i className={'fa fa-' + props.icon}></i>
      </label>
    </div>
  );
}

function EntryContainer(props) {
  if (displayMode === 'card' || displayMode === 'card-small') {
    return (
      <div id="entry-container">
        <CardContainer />
      </div>
    );
  }
  else if (displayMode === 'list') {
    return (
      <div id="entry-container">
        <ListContainer />
      </div>
    );
  }
  else return false;
}

function CardContainer(props) {
  const entries = data.entries.slice(0).reverse().map((entry) =>
    <Card key={entry.id} data={entry} />
  );
  return <div>{entries}</div>;
}

function Card(props) {
  function playYouTube(e) {
    setYouTubePlayerSrc(props.data, true);
  }

  if (props.data.userId !== -1) {
    const className = (displayMode === 'card')? 'card' : 'card card-small';
    return (
      <div className={className}>
        <img src={'https://img.youtube.com/vi/' + props.data.vid + '/0.jpg'} onClick={playYouTube} />
        <CardDescription data={props.data} />
      </div>
    );
  }
  return false;
}

function CardDescription(props) {
  return (
    <div className="description">
      <div className="entry-title">{props.data.title}</div>
      <div className="entry-artist">{props.data.artist}</div>
      <div className="entry-info">{props.data.date} {data.users[props.data.userId].name}</div>
      <EditIcon data={props.data} />
    </div>
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

  return (
    <a href="#" className="edit-icon" onClick={showEditDialog}>
      <i className="fa fa-pencil"></i>
    </a>
  );
}

function ListContainer(props) {
  const entries = data.entries.slice(0).reverse().map((entry) =>
    <ListItem key={entry.id} data={entry} />
  );
  return (
    <div id="list-container">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Shared By</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{entries}</tbody>
      </table>
    </div>
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
    setYouTubePlayerSrc(props.data, true);
  }

  if (props.data.userId !== -1) {
    return (
      <tr>
        <td>{props.data.title}</td>
        <td>{props.data.artist}</td>
        <td>{data.users[props.data.userId].name}</td>
        <td><a href="#" onClick={showEditDialog}><i className="fa fa-pencil"></i></a></td>
        <td><a href="#" onClick={playYouTube}><i className="fa fa-play"></i></a></td>
      </tr>
    );
  }
  return false;
}

/**
 * Dialog for adding a new song
 */
function AddDialog(props) {
  return (
    <div id="add-dialog">
      <div>
        <h3>Add New Song</h3>
        <AddDialogContent />
        <AddDialogButtonContainer />
      </div>
    </div>
  );
}

function AddDialogContent(props) {
  return (
    <div id="add-dialog-content">
      <table>
        <tbody>
          <DialogRow text="Song" inputId="new-song-title" inputPlaceholder="麻吉" />
          <DialogRow text="Artist" inputId="new-song-artist" inputPlaceholder="Machi" />
          <DialogRow text="YouTube" inputId="new-song-vid" inputPlaceholder="https://www.youtube.com/watch?v=XY0Jrbn0Ebo" />
          <tr>
            <td>User</td>
            <td><AddDialogUserSelect /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AddDialogUserSelect(props) {
  const options = data.users.map((user) =>
    <option key={user.id} value={user.id}>{user.name}</option>
  );
  return (
    <div className="select-wrapper">
      <select id="new-song-user-select">
        <option value="">Please select</option>
        {options}
      </select>
    </div>
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

    let date = new Date(),
        vid = newSongVid.value.split('v=')[1];

    // Parse YouTube URL
    if (!vid) {
      alert('Wrong format of YouTube URL!');
      return;
    }
    let youtubeAmpersandPos = vid.indexOf('&');
    if (youtubeAmpersandPos !== -1)
      vid = vid.substring(0, youtubeAmpersandPos);

    let data = {
      date: (date.getMonth() + 1) + '/' + (date.getDate()),
      title: newSongTitle.value,
      artist: newSongArtist.value,
      vid: vid,
      userId: newSongUserSelect.value
    };

    sendRequest('add', data, () => {
      loadData('users', null, render);
      loadData('entries', 'all', render);
    });
    document.getElementById('add-dialog').style.display = 'none';
    resetActiveButtons();
    resetInputs([newSongTitle, newSongArtist, newSongVid, newSongUserSelect]);
  }

  return (
    <div id="add-dialog-btn-container">
      <button onClick={cancel}>Cancel</button>
      <button onClick={addConfirm}>Confirm</button>
    </div>
  );
}

/**
 * Dialog for editing an entry
 */
function EditDialog(props) {
  return (
    <div id="edit-dialog">
      <div>
        <h3>Edit</h3>
        <EditDialogContent />
        <EditDialogButtonContainer />
      </div>
    </div>
  );
}

function EditDialogContent(props) {
  return (
    <div id="edit-dialog-content">
      <table>
        <tbody>
          <DialogRow text="Song" inputId="edit-song-title" />
          <DialogRow text="Artist" inputId="edit-song-artist" />
          <DialogRow text="YouTube Video ID" inputId="edit-song-vid" />
        </tbody>
      </table>
      <input type="hidden" id="id-hidden" />
      <input type="hidden" id="uid-hidden" />
    </div>
  );
}

function EditDialogButtonContainer(props) {
  function deleteEntry() {
    if (confirm('Are you sure to delete this entry?')) {
      let payload = {
        id: document.getElementById('id-hidden').value,
        userId: document.getElementById('uid-hidden').value
      };
      sendRequest('delete', payload, () => {
        loadData('users', null, render);
        loadData('entries', 'all', () => {
          render();
          let latestEntry = data.entries.slice(0).reverse()[0];
          setYouTubePlayerSrc(latestEntry, false);
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

    let data = {
      id: document.getElementById('id-hidden').value,
      title: editSongTitle.value,
      artist: editSongArtist.value,
      vid: editSongVid.value
    };

    sendRequest('edit', data, () => {
      loadData('entries', 'all', () => {
        render();
        let latestEntry = data.entries.slice(0).reverse()[0];
        setYouTubePlayerSrc(latestEntry, false);
      });
    });
    document.getElementById('edit-dialog').style.display = 'none';
    resetActiveButtons();
  }

  return (
    <div id="edit-dialog-btn-container">
      <table>
        <tbody>
          <tr>
            <td>
              <button onClick={deleteEntry}>Delete</button>
            </td>
            <td>
              <button onClick={cancel}>Cancel</button>
              <button onClick={editConfirm}>Confirm</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function DialogRow(props) {
  return (
    <tr>
      <td>{props.text}</td>
      <td>
        <input type="text"
          id={props.inputId}
          placeholder={props.inputPlaceholder} />
      </td>
    </tr>
  );
}

/**
 * Functions related to backend
 */
function sendRequest(action, payload, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (callback)
        callback(xhr.responseText);
    }
  };
  xhr.open('POST', `./php/${action}.php`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  if (typeof payload === 'object')
    xhr.send(JSON.stringify(payload));
  else  // `payload` is in type of string.
    xhr.send(payload);
}

function loadData(type, filter, callback) {
  sendRequest('load', {
    type: type,
    filter: filter
  }, (response) => {
    data[type] = JSON.parse(response);
    if (type === 'entries')
      entryFilter = filter;
    if (callback)
      callback();
  });
}

/**
 * Other functions
 */
function setYouTubePlayerSrc(entryData, autoPlay) {
  let vid = entryData.vid,
      src = 'https://www.youtube.com/embed/' + vid,
      targetElement = document.getElementById('youtube-player-frame');
  if (autoPlay) {
    src += '?autoplay=1';
    if (targetElement.src === src)
      return;
    let title = entryData.title,
        artist = entryData.artist,
        user = data.users[entryData.userId].name;
    notify(`Now Playing:<br>${artist} - ${title}<br>Shared by ${user}`);
  }
  targetElement.src = src;
}

function resetActiveButtons() {
  $('#sidebar button').each(function() {
    $(this).removeClass('active');
  });
}

function scrollToTop() {
  let body = $('body');
  body.stop().animate({scrollTop: 0}, '1000', 'swing');
}

function resetInputs(inputList) {
  for(let i = 0; i < inputList.length; i++) {
    let input = inputList[i],
        type = input.type;
    if (type === 'text')
      input.value = '';
    else if (type === 'select-one')
      input.selectedIndex = 0;
  }
}

function isInputsValid(inputList) {
  for(let i = 0; i < inputList.length; i++) {
    let input = inputList[i];
    if (input.value === '')
      return false;
  }
  return true;
}

/**
 * Initialize
 */
(function init() {
  let loadedDataCount = 0;
  loadData('users', null, loadDataSucceed);
  loadData('entries', 'all', loadDataSucceed);

  function loadDataSucceed() {
    loadedDataCount++;
    if (loadedDataCount === 2) {
      render(() => {
        let latestEntry = data.entries.slice(0).reverse()[0];
        setYouTubePlayerSrc(latestEntry, false);
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
