<?php
namespace model\sys;
class WebpackLoader
{
    private static $assets;
    private static $assetsPath = '../manageSystem/public/assets/assets/public/dist/';
    public static function loadAssets(){
        define('ASSETS_PATH',dirname(dirname(__DIR__)));
        $assetsFile = ASSETS_PATH.'/public/assets/webpack-assets.json';
        if (!is_file($assetsFile)){
            return false;
        }
        $json = file_get_contents($assetsFile);
        self::$assets = json_decode($json,true);
        return self::$assets;
    }
    public static function load($name){
        $map = self::loadAssets();
        return self::$assetsPath.$map[$name]['js'];
    }
}