<?php
class BaseController
{
    public $view;

    function __construct()
    {

    }

    public function __destruct()
    {
        if ($this->view instanceof View) {
            if(count($this->view->data)>0){
                extract($this->view->data);
            }
            require $this->view->view;
        }
    }

    public function json_die($code, $msg, $data = "")
    {
        $res = [
            'code' => $code,
            'msg' => $msg,
            'data' => $data
        ];
        die(json_encode($res,JSON_UNESCAPED_UNICODE));
    }
}