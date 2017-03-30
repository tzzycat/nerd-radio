<?php
  $users_filename = '../data/users.json';
  $entries_filename = '../data/entries.json';
  $users_data = json_decode(file_get_contents($users_filename), true);
  $entries_data = json_decode(file_get_contents($entries_filename), true);
  $input_data = json_decode(file_get_contents('php://input'), true);

  // Update users.json
  $target_user_id = intval($input_data['userId']);
  $i = 0;
  foreach($users_data as $user) {
    if($user['id'] === $target_user_id) {
      $users_data[$i]['numOfSongs']++;
      break;
    }
    $i++;
  }

  $f = fopen($users_filename, 'w');
  fwrite($f, json_encode($users_data));
  fclose($f);

  // Update entries.json
  array_push($entries_data, $input_data);
  $entry_count = count($entries_data);
  $entries_data[$entry_count - 1]['id'] = $entry_count - 1;

  $f = fopen($entries_filename, 'w');
  fwrite($f, json_encode($entries_data));
  fclose($f);
?>
