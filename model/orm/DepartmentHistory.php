<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/28
 * Time: 0:00
 */

namespace model\orm;
use Illuminate\Database\Eloquent\Model;


class DepartmentHistory extends Model {
    protected $table = 'department_history';
    protected $fillable = ['department_code','department_name','department_tel','id_ref'];
    public $timestamps = false;
}