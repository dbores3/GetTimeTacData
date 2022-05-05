<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Testing\Fluent\AssertableJson;


class ExportsTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */

    // @desc Tests the route to download the CSV file
    public function testExportCsvRoute()
    {
        $response = $this->get('/exportCSV');

        $response->assertStatus(200);
    }

    // @desc Tests if the HTML file is Downloadable
    public function testExportCsvIsDownloadable(){
        $response = $this->get('/exportCSV');
        $response->assertDownload('TimeTac.csv');
    }


    // @desc Tests the route to download the JSON file
    public function testExportJsonRoute(){
        $response = $this->getJson('/exportJSON');

        $response->assertStatus(200);
    }

    // @desc Tests the structure and the attributes of the JSON 
    public function testExportJsonHasAttributes(){
        $response = $this->getJson('/exportJSON');
        $response->assertJsonStructure(
            ['*' =>['id','firstname','lastname']]
        );
    }

    // @desc Tests the fields types in the JSON
    public function testExportJsonAttributesTypes(){
        $response = $this->getJson('/exportJSON');
        $response->assertJson(fn (AssertableJson $json) =>
            $json->whereAllType([
                    '0.id' => 'integer',
                    '0.firstname' => 'string',
                    '0.lastname' => 'string',
            ])
        );
    }

    // @desc Tests the route to download the HTML file
    public function testExportHtmlRoute(){
        $response = $this->get('/exportHTML');

        $response->assertStatus(200);
    }
    
    // @desc Tests if the HTML file is Downloadable
    public function testExportHtmlIsDownloadable(){
        $response = $this->get('/exportHTML');
        $response->assertDownload('TimeTac.html');
    }

}
