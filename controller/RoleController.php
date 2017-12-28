<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/19
 * Time: 18:27
 */
use model\orm\Role;
use model\orm\User;
use Illuminate\Database\Capsule\Manager as DB;
use model\orm\Log;
use model\orm\RoleHistory;

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
                ->where(function ($query){
                    $query->whereIn('role.is_check', [2,3,4]);
                })
                ->orWhere(function ($query){
                    $query->where('role.is_check', 1)->where('role.deleted_at', NULL);
                })
                ->get()->toArray();
            $roleTotalData = $roleData;
        }else if(in_array(2,$userPermission)) {  //审核员
            $roleData = Role::select('role.id as key','role_code','role_name','permission','is_check')
                ->withTrashed()
                ->whereIn('role.is_check', [2,3,4])->get()->toArray();
            $roleTotalData = $roleData;
//            print_r($userData);
//            exit();
        }
        foreach ($roleTotalData as $key => $item) {
            if ($item['is_check']==1) $roleTotalData[$key]['is_check'] = '已审核';
            else $roleTotalData[$key]['is_check'] = '待审核';
        }
        $this->json_die(200,'success',$roleTotalData);
    }
    public function insertRole() {
        $role_code = $_POST['role_code'];
        $role_name = $_POST['role_name'];
        $permission = $_POST['permission'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."添加了角色代码为".$role_code."的".$role_name;


        if(Role::where('role_code',$role_code)->count() === 0){
            DB::beginTransaction();
            try {
                $userPermission = $this->judgePermission();
                if(in_array(1,$userPermission)) {   //管理员
                    $role = Role::create([
                        'role_code' => $role_code,
                        'role_name' => $role_name,
                        'permission' => $permission,
                        'is_check' => 2
                    ]);
                    $ip_address = $_SERVER['REMOTE_ADDR'];
                    $log = Log::create([
                        'ip_address' => $ip_address,
                        'user_id' => $oper_user_id,
                        'operation' => $operation
                    ]);
                    DB::commit();
                    $this->json_die(200, 'success', $role->id);
                }else $this->json_die(402, 'no permission', '');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }
        } else $this->json_die(403, 'role has existed', '');
    }

    public function deleteRole()
    {
        $id = $_POST['id'];
        $oper_staff_code = json_decode($_COOKIE['userInfo'], true)['staff_code'];
        $oper_user = User::select('id', 'username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $deleted_role = Role::select('role_code', 'role_name')->where('id', $id)->withTrashed()->get()->toArray();
//        print_r($deleted_user);
//        exit();
        $deleted_role_code = $deleted_role[0]['role_code'];
        $deleted_role_name = $deleted_role[0]['role_name'];

        $operation = "员工号为" . $oper_staff_code . "的" . $oper_user_name . "删除了角色代码为" . $deleted_role_code . "的" . $deleted_role_name;

        $currentRoleIsCheckStatus = Role::select('is_check')->where('id', $id)->get()->toArray();

//        print_r($currentRoleIsCheckStatus[0]['is_check']);
//        exit();
        if ($currentRoleIsCheckStatus[0]['is_check'] == 1) {
            DB::beginTransaction();
            try {
                $userPermission = $this->judgePermission();
                if (in_array(1, $userPermission)) {   //管理员
                    $roleDeleted = Role::where('id', $id)->first();
                    $roleDeleted->is_check = 3; //删
                    $roleDeleted->save();
                    Role::find($id)->delete();
                    $ip_address = $_SERVER['REMOTE_ADDR'];
                    Log::create([
                        'ip_address' => $ip_address,
                        'user_id' => $oper_user_id,
                        'operation' => $operation
                    ]);
                    DB::commit();
                    $this->json_die(200, 'success');
                } else $this->json_die(402, 'no permission', '');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }
        }else {
            $this->json_die(407, 'please wait check', '');
        }
    }
    public function getCheckRoleInfor() {
        $id = $_POST['id'];
        $checkRoleInfor = Role::select('role_code','role_name','permission')
            ->where('id', $id)
            ->get()->toArray();
//        print_r($checkUserInfor[0]['staff_code']);
//        exit();
        if($checkRoleInfor)$this->json_die(200, 'success',$checkRoleInfor);
        else $this->json_die(500, 'unknown error');
    }
    public function updateRole() {
        $checkRoleCode = $_POST['checkRoleCode'];
        $checkRoleName = $_POST['checkRoleName'];
        $checkPermission = $_POST['checkPermission'];

        $id = $_POST['id'];
        $role_code = $_POST['role_code'];
        $role_name = $_POST['role_name'];
        $permission = $_POST['permission'];
//        $permissionInData = str_replace(' ','',$permission);
//        $permissionInData = substr($permissionInData,1,strlen($permissionInData)-2);
//        $permissionInData = mb_split(',',$permissionInData);
//        $permisssionTemp = [];
//        foreach ($permissionInData as $key => $value){
//            switch ($value) {
//                case '管理权限':
//                    $permisssionTemp[] = 1;
//                    break;
//                case '审核权限':
//                    $permisssionTemp[] = 2;
//                    break;
//                case '日志权限':
//                    $permisssionTemp[] = 3;
//                    break;
//                default:
//                    $permisssionTemp[] = (int)$value;
//            }
//        }
//        $permisssionTemp = json_encode($permisssionTemp,JSON_UNESCAPED_UNICODE);
////        print_r($permisssionTemp);
//        exit();

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $update_role = Role::select('role_code', 'role_name')->where('id',$id)->get()->toArray();
        $update_role_code = $update_role[0]['role_code'];
        $update_role_name = $update_role[0]['role_name'];

        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."修改了角色代码为".$update_role_code."的".$update_role_name.'的信息';

        $currentRoleIsCheckStatus = Role::select('is_check')->where('id', $id)->get()->toArray();

        if($currentRoleIsCheckStatus[0]['is_check'] == 1) {
            if(Role::where('role_code',$role_code)->count() === 1){
                DB::beginTransaction();
                try {
                    $userPermission = $this->judgePermission();
                    if(in_array(1,$userPermission)) {   //管理员
                        $roleUpdate = Role::where('id',$id)->first();
                        $roleUpdate->role_code = $role_code;
                        $roleUpdate->role_name = $role_name;
                        $roleUpdate->permission = $permission;
                        $roleUpdate->is_check = 4;  //改
                        $roleUpdate->save();
//
                        $roleHistory = RoleHistory::create([
                            'role_code' => $checkRoleCode,
                            'role_name' => $checkRoleName,
                            'permission' => $checkPermission,
                            'id_ref' => $id
                        ]);
                        $ip_address = $_SERVER['REMOTE_ADDR'];
                        $log = Log::create([
                            'ip_address' => $ip_address,
                            'user_id' => $oper_user_id,
                            'operation' => $operation
                        ]);
                        DB::commit();
                        $this->json_die(200, 'success');
                    }else $this->json_die(402, 'no permission', 'no permission');
                } catch (\Exception $e) {
                    DB::rollBack();
                    $this->json_die(500, 'unknown error', $e);
                }
            }
        }else{
            $this->json_die(407, 'please wait check', '');
        }
    }

    public function rolePass() {
        $id = $_POST['id'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $pass_role = Role::select('role_code', 'role_name','is_check')->where('id',$id)->withTrashed()->get()->toArray();

        $pass_role_code = $pass_role[0]['role_code'];
        $pass_role_name = $pass_role[0]['role_name'];
        $pass_role_isCheck = $pass_role[0]['is_check'];

        $ip_address = $_SERVER['REMOTE_ADDR'];
        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."审核通过了角色代码为".$pass_role_code."的".$pass_role_name.'的信息';

        if($pass_role_isCheck == 2 || $pass_role_isCheck == 3) {
            DB::beginTransaction();
            try {
                $needPassRole = Role::withTrashed()->where('id',$id)->first();
                $needPassRole -> is_check = 1;
                $needPassRole -> save();

                $log = Log::create([
                    'ip_address' => $ip_address,
                    'user_id' => $oper_user_id,
                    'operation' => $operation
                ]);

                DB::commit();
                $this->json_die(200, 'success');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }
        }else if($pass_role_isCheck == 4){
            DB::beginTransaction();
            try {
                $needPassRole = Role::where('id',$id)->first();
                $needPassRole -> is_check = 1;
                $needPassRole -> save();

                RoleHistory::where('id_ref',$id)->first()->delete();
                $log = Log::create([
                    'ip_address' => $ip_address,
                    'user_id' => $oper_user_id,
                    'operation' => $operation
                ]);

                DB::commit();
                $this->json_die(200, 'success');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }
        }
    }

    public function roleNoPass() {
        $id = $_POST['id'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $no_pass_role = Role::select('role_code', 'role_name','is_check')->where('id',$id)->withTrashed()->get()->toArray();

        $no_pass_role_code = $no_pass_role[0]['role_code'];
        $no_pass_role_name = $no_pass_role[0]['role_name'];
        $no_pass_role_isCheck = $no_pass_role[0]['is_check'];

        $ip_address = $_SERVER['REMOTE_ADDR'];
        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."审核不通过了角色代码为".$no_pass_role_code."的".$no_pass_role_name.'的信息';
        if($no_pass_role_isCheck == 2) {  //增
            DB::beginTransaction();
            try {
                $needPassRole = Role::where('id',$id)->withTrashed()->first();
                $needPassRole -> is_check = 1;
                $needPassRole -> save();
                $needPassRole -> delete();

                $log = Log::create([
                    'ip_address' => $ip_address,
                    'user_id' => $oper_user_id,
                    'operation' => $operation
                ]);

                DB::commit();
                $this->json_die(200, 'success');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }

        }else if($no_pass_role_isCheck == 3) { //删
            DB::beginTransaction();
            try {
                $needPassRole = Role::where('id',$id)->withTrashed()->first();
                $needPassRole -> is_check = 1;
                $needPassRole -> restore();

                $log = Log::create([
                    'ip_address' => $ip_address,
                    'user_id' => $oper_user_id,
                    'operation' => $operation
                ]);

                DB::commit();
                $this->json_die(200, 'success');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }

        }else if($no_pass_role_isCheck == 4) { //改
            DB::beginTransaction();
            try {
                $needPassRoleHistory = RoleHistory::where('id_ref',$id)->first();

                $needPassRole = Role::where('id',$id)->first();
                $needPassRole -> role_code = $needPassRoleHistory->role_code;
                $needPassRole -> role_name = $needPassRoleHistory->role_name;
                $needPassRole -> permission = $needPassRoleHistory->permission;
                $needPassRole -> is_check = 1;
                $needPassRole -> save();
                $needPassRoleHistory -> delete();

                $log = Log::create([
                    'ip_address' => $ip_address,
                    'user_id' => $oper_user_id,
                    'operation' => $operation
                ]);

                DB::commit();
                $this->json_die(200, 'success');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }
        }
    }
}