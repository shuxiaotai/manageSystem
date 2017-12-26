<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/18
 * Time: 17:49
 */

namespace model\orm;
use Illuminate\Database\Eloquent\Model;

class Role extends Model{
    protected $table = 'role';
    protected $fillable = ['role_name', 'permission','is_check','deleted_at'];
    public $timestamps = false;
}