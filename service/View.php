<?php
class View
{
    const VIEW_BASE_PATH = APP_PATH.'/views/';
    public $view;
    public $data;
    public function __construct($view)
    {
        $this->view = $view;
    }
    public static function create($fileName = null){
        if(!$fileName) throw new Exception('文件名不能为空');
        else{
            $viewPath = self::getFilePath($fileName);
            if(is_file($viewPath)) {
                return new View($viewPath);
            }
            else throw new Exception("文件不存在".$viewPath);
        }
    }
    public function with($key,$data){
        $this->data[$key] = $data;
        return $this;
    }
    public function __call($name, $arguments)
    {
        if(starts_with($name,'with')){
            $this->with(substr($name,4),$arguments[0]);
            return $this;
        }
        else{
            throw new BadMethodCallException('方法不存在');
        }
    }

    public static function getFilePath($viewName){
        return self::VIEW_BASE_PATH.$viewName.'.php';
    }
}