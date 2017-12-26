<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/19
 * Time: 9:18
 */
use model\orm\Log;
use model\orm\User;
class LogController extends BaseController {

    public function judgePermission () {
        $staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $judge = User::where('staff_code', $staff_code)->join('role','user.role_id','=','role.id')
            ->select('permission')->get()->toArray();
        return json_decode($judge[0]['permission'], true);
    }
    public function fetchLogInfor() {
        $userPermission = $this->judgePermission();
        if(in_array(3,$userPermission)){     //日志员
            $userLogData = Log::select('log.id as key','ip_address','operation','username as person','created_at')
                ->join('user','user.id','=','log.user_id')
                ->get()->toArray();
            $this->json_die(200,'success',$userLogData);
        }else {
            $this->json_die(402,'no permission');
        }
    }

}