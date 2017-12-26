<?php
namespace model\orm;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Model
{
    use SoftDeletes;
    protected $table = 'user';
    protected $fillable=['staff_code','username','password','department_id','education','major','age','address','role_id','email','is_check'];
    public $timestamps = false;
}