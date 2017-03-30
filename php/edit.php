<?php
  $entries_filename = '../data/entries.json';
  $entries_data = json_decode(file_get_contents($entries_filename), true);
  $input_data = json_decode(file_get_contents('php://input'), true);

  $target_id = intval($input_data['id']);
  $entries_data[$target_id]['title'] = $input_data['title'];
  $entries_data[$target_id]['artist'] = $input_data['artist'];
  $entries_data[$target_id]['vid'] = $input_data['vid'];

  $f = fopen($entries_filename, 'w');
  fwrite($f, json_encode($entries_data));
  fclose($f);
?>
