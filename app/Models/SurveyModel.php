<?php namespace App\Models;

use CodeIgniter\Model;

class SurveyModel extends Model
{
    protected $table = 'survey';
    protected $primaryKey = 'surveyid';
    protected $allowedFields = ['surveyname'];
    
    protected $useTimestamps = false;
    
    public function getSurveyData()
    {
        $builder = $this->db->table('survey s');
        $builder->select('s.surveyid, s.surveyname, i.itemid, i.text as question_text, o.optionid, o.optionname, o.text as option_data');
        $builder->join('item i', 'i.surveyid = s.surveyid', 'left');
        $builder->join('options o', 'o.optionid = i.optionid', 'left');
        $builder->orderBy('s.surveyid, i.itemid');
        
        $query = $builder->get();
        $results = $query->getResultArray();
        
        $formatted = [];
        
        foreach ($results as $row) {
            $surveyId = $row['surveyid'];
            
            if (!isset($formatted[$surveyId])) {
                $formatted[$surveyId] = [
                    'surveyid' => $surveyId,
                    'surveyname' => $row['surveyname'],
                    'questions' => []
                ];
            }
            
            if (empty($row['itemid'])) {
                continue;
            }
            
            $questionId = $row['itemid'];
            
            if (!isset($formatted[$surveyId]['questions'][$questionId])) {
                $formatted[$surveyId]['questions'][$questionId] = [
                    'itemid' => $questionId,
                    'text' => $row['question_text'],
                    'options' => []
                ];
            }
            
            if (!empty($row['optionid'])) {
                $options = json_decode($row['option_data'], true);
                
                foreach ($options as $option) {
                    $formatted[$surveyId]['questions'][$questionId]['options'][] = [
                        'label' => $option['text'],
                        'value' => $option['score']
                    ];
                }
            }
        }
        
        return array_values($formatted);
    }
}