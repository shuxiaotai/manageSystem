<?php
use model\orm\User;
class LoginController extends BaseController
{
    public function login(){
        $userName = $_POST['username'];
        $passWord = $_POST['password'];
        $userResp = User::select('password','staff_code','permission')
            ->join('role','user.role_id','=','role.id')
            ->where('username',$userName)->get()->toArray();
        if(count($userResp)>0 && md5($passWord) === $userResp[0]['password']){
            setcookie('userInfo',json_encode(['username'=>$userName,'staff_code'=>$userResp[0]['staff_code'],'permission'=>$userResp[0]['permission']],JSON_UNESCAPED_UNICODE),0,'/');
            $this->json_die(200,'success');
        }else {
            $this->json_die(401,'fail');
        }
    }
    public function logout(){
        session_start();
        if(isset($_COOKIE['userInfo']) && $_COOKIE['userInfo'] !== null) {
            setcookie('userInfo','');
            $this->json_die(200,'success',null);
        }
        else $this->json_die(403,'not login',null);
    }
}