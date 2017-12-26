<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/19
 * Time: 9:10
 */

namespace model\orm;
use Illuminate\Database\Eloquent\Model;


class Log extends Model{
    protected $table = 'log';
    protected $fillable = ['ip_address', 'operation', 'user_id'];
    public $timestamps = true;
}