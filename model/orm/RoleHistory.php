<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/27
 * Time: 23:58
 */

namespace model\orm;
use Illuminate\Database\Eloquent\Model;


class RoleHistory extends Model{
    protected $table = 'role_history';
    protected $fillable = ['role_code','role_name','permission','id_ref'];
    public $timestamps = false;
}