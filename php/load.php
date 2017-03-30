<?php
  $users_filename = '../data/users.json';
  $entries_filename = '../data/entries.json';

  $filter = json_decode(file_get_contents('php://input'), true);
  if ($filter['type'] === 'users') {
    $users_data = json_decode(file_get_contents($users_filename), true);
    echo json_encode($users_data);
  }
  else if ($filter['type'] === 'entries') {
    $entries_data = json_decode(file_get_contents($entries_filename), true);
    if ($filter['filter'] === 'all')
      echo json_encode($entries_data);
    else {
      $response_data = array();
      $i = 0;
      foreach($entries_data as $entry) {
        if(intval($entry["userId"]) === $filter['filter'])
          array_push($response_data, $entries_data[$i]);
        $i++;
      }
      echo json_encode($response_data);
    }
  }
  else echo 'Error: Unknown "type" in function loadData()';
?>
