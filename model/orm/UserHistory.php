<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/19
 * Time: 21:29
 */

namespace model\orm;
use Illuminate\Database\Eloquent\Model;

class UserHistory extends Model{
    protected $table = 'user_history';
    protected $fillable = ['staff_code','username','department_id','education','major','age','address','role_id','email','id_ref'];
    public $timestamps = false;
}