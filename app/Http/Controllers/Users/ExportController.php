<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//Trait for connecting to the Time Tac's API
use App\Traits\TraitConnectTimeTac;

class ExportController extends Controller
{
    //calls the Trait
    use TraitConnectTimeTac;
    
    // @desc    Exports all the users into a CSV format
    // @route   GET /exportCSV
    // @access  Public
    public function exportCSV(){
        //Gets all the users from the API
        $users = $this->connectTimeTacAPI();
        
        //File's headers
        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=TimeTac.csv",
        );

        //Sets the columns 
        $columns = array('ID', 'First Name', 'Last Name');

        //Callback function to fill the CSV and be passed as an argument in the response 
        $callbackFile = function() use($users, $columns) {
            //Opens the new file(it doesn't save the file in the system)
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            //Fills the users
            foreach ($users as $user) {
                $row['ID'] = $user['id'];
                $row['First Name'] = $user['firstname'];
                $row['Last Name'] = $user['lastname'];
                //Inserts into the file
                fputcsv($file, 
                    array(
                        $row['ID'], 
                        $row['First Name'], 
                        $row['Last Name']
                    )
                );
            }
            //Closes the just created file
            fclose($file);
        };
        //Returns a downloadable response
        return response()->stream($callbackFile, 200, $headers);
    }

    // @desc    Exports all the users into a JSON format
    // @route   GET /exportJSON
    // @access  Public
    public function exportJSON(){
        //Gets all the users from the API
        $users = $this->connectTimeTacAPI();
        $usersJSON = Array();
        //Fills the new array with the users from the API
        foreach($users as $user){
            array_push($usersJSON,
                Array(
                    'id' => $user['id'],
                    'firstname' => $user['firstname'],
                    'lastname' => $user['lastname']
                )
            );
        }
        //Encodes the array into JSON
        $usersJSON = json_encode($usersJSON);
        
        return $usersJSON;
    }

    // @desc    Exports all the users into a HTML format
    // @route   GET /exportHTML
    // @access  Public
    public function exportHTML(){
        //Gets all the users from the API
        $users = $this->connectTimeTacAPI();
        
        //File's headers
        $headers = array(
            "Content-type"        => "text/html",
            "Content-Disposition" => "attachment; filename=TimeTac.html",
        );

        //Callback function to fill the HTML and be passed as an argument in the response 
        $callbackFile = function() use($users) {
            $contentHML = '
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="description" content="Time Tac User module">
                <meta name="author" content="DavidBores">
                <meta name="theme-color" content="#102040">
                <title>TimeTac</title>
                <link href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" rel="stylesheet">
            </head>
            <body>
                <section class="content ">
                    <h1>Time Tac</h1>
                    <h2>List of users</h2>     
                    <table class="display" id="usersTable" width="100%" data-name="Users">
                        <thead class="thead-dark">
                            <tr class="w3-cyan">
                                <th data-priority="1">ID</th>
                                <th data-priority="3">First Name</th>
                                <th data-priority="4">Last Name</th>
                            </tr>
                        </thead>
                        <tbody>
            ';

            $file = fopen('php://output', 'w');
            //Fills up the users
            foreach ($users as $user) {
                $contentHML .= '
                    <tr>
                        <td>'.$user['id'].'</td>
                        <td>'.$user['firstname'].'</td>
                        <td>'.$user['lastname'].'</td>
                    </tr>
                ';    
            }
            $contentHML .= ' 
            </tbody>
            </section>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
                <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
                <script src="http://127.0.0.1:8000/js/table-data.js"></script>
                <script src="http://127.0.0.1:8000/js/downloadfiles.js"></script>
            </body></html>';

            //Writes the HTML into the file
            fwrite($file, $contentHML);
            fclose($file);
        };

        //Returns a downloadable response
        return response()->stream($callbackFile, 200, $headers);
    }

}
