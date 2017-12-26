<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/18
 * Time: 17:37
 */

namespace model\orm;
use Illuminate\Database\Eloquent\Model;

class Department extends Model{
    protected  $table = 'department';
    protected $fillable = ['department_code', 'department_name', 'department_tel','parent_id','is_check','deleted_at'];
    public $timestamps = false;
}