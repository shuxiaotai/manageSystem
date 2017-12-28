<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/18
 * Time: 17:49
 */

namespace model\orm;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model{
    use SoftDeletes;
    protected $table = 'role';
    protected $fillable = ['role_code','role_name', 'permission','is_check','deleted_at'];
    public $timestamps = false;
}