<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/19
 * Time: 18:27
 */
use model\orm\Role;
use model\orm\User;

class RoleController extends BaseController {

    public function fetchRoles() {
        $roles = Role::pluck('role_name')->toArray();
        $this->json_die(200,'success',$roles);
    }

    public function judgePermission () {
        $staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $judge = User::where('staff_code', $staff_code)->join('role','user.role_id','=','role.id')
            ->select('permission')->get()->toArray();
        return json_decode($judge[0]['permission'], true);
    }

    public function getRolesInfor() {
        $userPermission = $this->judgePermission();
        if(in_array(1,$userPermission)){     //管理员
            $roleData = Role::select('role.id as key','role_code','role_name','permission','is_check')
                ->get()->toArray();
        }
        foreach ($roleData as $key => $item) {
            if ($item['is_check']===1) $roleData[$key]['is_check'] = '已审核';
            else $roleData[$key]['is_check'] = '待审核';
        }
        $this->json_die(200,'success',$roleData);
    }
}