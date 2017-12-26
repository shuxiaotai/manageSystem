<?php
use Illuminate\Database\Capsule\Manager as Capsule;
require './vendor/autoload.php';
define('BASE_PATH', __DIR__);
//ini_set("session.cookie_httponly", 0);
ini_set('date.timezone','Asia/Shanghai');
$capsule = new Capsule();
$capsule->addConnection(require 'config/database.php');
$capsule->bootEloquent();
$capsule->setAsGlobal();
$whoops = new \Whoops\Run();
$whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler());
$whoops->register();