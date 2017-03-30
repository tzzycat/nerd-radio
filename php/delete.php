<?php
  $users_filename = '../data/users.json';
  $entries_filename = '../data/entries.json';
  $users_data = json_decode(file_get_contents($users_filename), true);
  $entries_data = json_decode(file_get_contents($entries_filename), true);

  $input_data = json_decode(file_get_contents('php://input'), true);
  $target_id = intval($input_data['id']);
  $target_uid = intval($input_data['userId']);

  // Update users.json
  $i = 0;
  foreach($users_data as $user) {
    if($user['id'] === $target_uid) {
      $users_data[$i]['numOfSongs']--;
      break;
    }
    $i++;
  }

  $f = fopen($users_filename, 'w');
  fwrite($f, json_encode($users_data));
  fclose($f);

  // Update entries.json
  $entries_data[$target_id]['userId'] = -1;

  $f = fopen($entries_filename, 'w');
  fwrite($f, json_encode($entries_data));
  fclose($f);
?>
