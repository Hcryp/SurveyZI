<?php namespace App\Controllers;

use App\Models\SurveyModel;
use CodeIgniter\API\ResponseTrait;

class SurveyController extends BaseController
{
    use ResponseTrait;

    public function getSurveyData()
    {
        $surveyModel = new SurveyModel();
        $surveyData = $surveyModel->getSurveyData();
    
        return $this->response->setJSON($surveyData);
    }
}