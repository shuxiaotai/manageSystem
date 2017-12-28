<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/20
 * Time: 10:31
 */

use model\orm\Department;
use model\orm\User;
use Illuminate\Database\Capsule\Manager as DB;
use model\orm\Log;
use model\orm\DepartmentHistory;

class DepartmentController extends BaseController {
    public function fetchDepartments() {
        $departments = Department::pluck('department_name')->toArray();
        $this->json_die(200,'success',$departments);
    }

    public function judgePermission () {
        $staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $judge = User::where('staff_code', $staff_code)->join('role','user.role_id','=','role.id')
            ->select('permission')->get()->toArray();
        return json_decode($judge[0]['permission'], true);
    }
    public function getDepartmentsInfor() {
        $userPermission = $this->judgePermission();
        if(in_array(1,$userPermission)){     //管理员
            $departmentData = Department::select('department.id as key','department_code','department_name','department_tel', 'parent_id','is_check')
                ->where(function ($query){
                    $query->whereIn('department.is_check', [2,3,4]);
                })
                ->orWhere(function ($query){
                    $query->where('department.is_check', 1)->where('department.deleted_at', NULL);
                })
                ->get()->toArray();
            $departmentNewData = array_column($departmentData, null, 'key');
//            print_r($departmentNewData);
//            exit();
            foreach ($departmentData as $key => $value) {
                if ($value['parent_id'] != 0) {
                    $departmentData[$key]['department_name'] =
                        $departmentNewData[$value['parent_id']]['department_name'].'/'.$value['department_name'];
//                    print_r($departmentNewData[$value['parent_id']]);
//                    exit();

                    $departmentData[$key]['parent_name'] = $departmentNewData[$value['parent_id']]['department_name'];
                }else {
                    $departmentData[$key]['parent_name'] = '无';
                }
            }
            $departmentTotal = $departmentData;
//            print_r($departmentData);
//            exit();
        }else if(in_array(2,$userPermission)) {  //审核员
            $departmentParentData = Department::select('department.id as key','department_code','department_name','department_tel', 'parent_id','is_check')
                ->get()->toArray();
            $departmentData = Department::select('department.id as key','department_code','department_name','department_tel', 'parent_id','is_check')
                ->whereIn('department.is_check', [2,3,4])->get()->toArray();
            $departmentNewParentData = array_column($departmentParentData, null, 'key');
//            print_r($departmentNewData);
//            exit();
            foreach ($departmentData as $key => $value) {
                if ($value['parent_id'] != 0) {
                    $departmentData[$key]['department_name'] =
                        $departmentNewParentData[$value['parent_id']]['department_name'].'/'.$value['department_name'];
//                    print_r($departmentNewData[$value['parent_id']]);
//                    exit();

                    $departmentData[$key]['parent_name'] = $departmentNewParentData[$value['parent_id']]['department_name'];
                }else {
                    $departmentData[$key]['parent_name'] = '无';
                }
            }
            $departmentTotal = $departmentData;
        }
        foreach ($departmentTotal as $key => $item) {
            if ($item['is_check']==1) $departmentTotal[$key]['is_check'] = '已审核';
            else $departmentTotal[$key]['is_check'] = '待审核';
        }
        $this->json_die(200,'success',$departmentTotal);
    }
    public function insertDepartment() {
        $department_code = $_POST['department_code'];
        $department_name = $_POST['department_name'];
        $parent_name = $_POST['parent_name'];
        $department_tel = $_POST['department_tel'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."添加了角色代码为".$department_code."的".$department_name;

        $parent_id = 0;
        if($parent_name == '无') {
            $parent_id = 0;
        }else{
            $hasDepartParentName = Department::where('department_name', $parent_name)->get()->toArray();
            $parent_id = $hasDepartParentName[0]['id'];
        }

        if(Department::where('department_code',$department_code)->count() === 0){
            DB::beginTransaction();
            try {
                $userPermission = $this->judgePermission();
                if(in_array(1,$userPermission)) {   //管理员
                    $department = Department::create([
                        'department_code' => $department_code,
                        'department_name' => $department_name,
                        'parent_id' => $parent_id,
                        'department_tel' => $department_tel,
                        'is_check' => 2
                    ]);
                    $ip_address = $_SERVER['REMOTE_ADDR'];
                    $log = Log::create([
                        'ip_address' => $ip_address,
                        'user_id' => $oper_user_id,
                        'operation' => $operation
                    ]);
                    DB::commit();
                    $this->json_die(200, 'success', $department->id);
                }else $this->json_die(402, 'no permission', '');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }
        } else $this->json_die(403, 'role has existed', '');
    }

    public function deleteDepartment()
    {
        $id = $_POST['id'];
        $oper_staff_code = json_decode($_COOKIE['userInfo'], true)['staff_code'];
        $oper_user = User::select('id', 'username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $deleted_department = Department::select('department_code', 'department_name')->where('id', $id)->withTrashed()->get()->toArray();
//        print_r($deleted_user);
//        exit();
        $deleted_department_code = $deleted_department[0]['department_code'];
        $deleted_department_name = $deleted_department[0]['department_name'];

        $operation = "员工号为" . $oper_staff_code . "的" . $oper_user_name . "删除了部门代码为" . $deleted_department_code . "的" . $deleted_department_name;

        $currentDepartmentIsCheckStatus = Department::select('is_check')->where('id', $id)->get()->toArray();

//        print_r($currentUserIsCheckStatus[0]['is_check']);
//        exit();

        if ($currentDepartmentIsCheckStatus[0]['is_check'] == 1) {
            DB::beginTransaction();
            try {
                $userPermission = $this->judgePermission();
                if (in_array(1, $userPermission)) {   //管理员
                    $departmentDeleted = Department::where('id', $id)->first();
                    $departmentDeleted->is_check = 3; //删
                    $departmentDeleted->save();
                    Department::find($id)->delete();
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
        } else {
            $this->json_die(407, 'please wait check', '');
        }
    }
    public function getCheckDepartmentInfor() {
        $id = $_POST['id'];
        $departmentData = Department::select('department.id as key','department_code','department_name','department_tel', 'parent_id')
            ->get()->toArray();
        $departmentDataId = Department::select('parent_id')
            ->where('id',$id)
            ->get()->toArray();
        $departmentNewData = array_column($departmentData, null, 'key');
        foreach ($departmentNewData as $key => $value) {
            if ($value['parent_id']) {
                $departmentNewData[$key]['parent_name'] = $departmentNewData[$value['parent_id']]['department_name'];
            }else {
                $departmentNewData[$key]['parent_name'] = '无';
            }
        }

        $checkDepartmentInfor = $departmentNewData[$id];
        if($checkDepartmentInfor)$this->json_die(200, 'success',$checkDepartmentInfor);
        else $this->json_die(500, 'unknown error');
    }
    public function updateDepartment () {
        $checkDepartmentCode = $_POST['checkDepartmentCode'];
        $checkDepartmentName = $_POST['checkDepartmentName'];
        $checkDepartmentTel = $_POST['checkDepartmentTel'];
        $checkParentId = $_POST['checkParentId'];

        $id = $_POST['id'];
        $department_code = $_POST['department_code'];
        $department_name = $_POST['department_name'];
        $department_tel = $_POST['department_tel'];
        $parent_name = $_POST['parent_name'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $parent_id = Department::select('id')->where('department_name', $parent_name)->get()->toArray();
        $parent_id = $parent_id[0]['id'];

        $update_department = Department::select('department_code', 'department_name')->where('id',$id)->get()->toArray();
        $update_department_code = $update_department[0]['department_code'];
        $update_department_name = $update_department[0]['department_name'];

        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."修改了部门代码为".$update_department_code."的".$update_department_name.'的信息';

        $currentDepartmentIsCheckStatus = Department::select('is_check')->where('id', $id)->get()->toArray();

        if($currentDepartmentIsCheckStatus[0]['is_check'] == 1) {
            if(Department::where('department_code',$department_code)->count() === 1){
                DB::beginTransaction();
                try {
                    $userPermission = $this->judgePermission();
                    if(in_array(1,$userPermission)) {   //管理员
                        $departmentUpdate = Department::where('id',$id)->first();
                        $departmentUpdate->department_code = $department_code;
                        $departmentUpdate->department_name = $department_name;
                        $departmentUpdate->department_tel = $department_tel;
                        $departmentUpdate->parent_id = $parent_id;
                        $departmentUpdate->is_check = 4;
                        $departmentUpdate->save();
//
                        $departmentHistory = DepartmentHistory::create([
                            'department_code' => $checkDepartmentCode,
                            'department_name' => $checkDepartmentName,
                            'department_tel' => $checkDepartmentTel,
                            'parent_id' => $checkParentId,
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
    public function departmentPass() {
        $id = $_POST['id'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $pass_department = Department::select('department_code', 'department_name','is_check')->where('id',$id)->withTrashed()->get()->toArray();
//        print_r($pass_user);
//        exit();
        $pass_department_code = $pass_department[0]['department_code'];
        $pass_department_name = $pass_department[0]['department_name'];
        $pass_department_isCheck = $pass_department[0]['is_check'];

        $ip_address = $_SERVER['REMOTE_ADDR'];
        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."审核通过了部门代码为".$pass_department_code."的".$pass_department_name.'的信息';

        if($pass_department_isCheck == 2 || $pass_department_isCheck == 3) {
            DB::beginTransaction();
            try {
                $needPassDepartment = Department::withTrashed()->where('id',$id)->first();
                $needPassDepartment -> is_check = 1;
                $needPassDepartment -> save();

                $log = Log::create([
                    'ip_address' => $ip_address,
                    'user_id' => $oper_user_id,
                    'operation' => $operation
                ]);

                DB::commit();
                $this->json_die(200, 'success');
            } catch (\Exception $e) {
                DB::rollBack();
//                print_r($e);
//                exit();
                $this->json_die(500, 'unknown error', $e);
            }
        }else if($pass_department_isCheck == 4){
            DB::beginTransaction();
            try {
                $needPassDepartment = Department::where('id',$id)->first();
                $needPassDepartment -> is_check = 1;
                $needPassDepartment -> save();

                DepartmentHistory::where('id_ref',$id)->first()->delete();
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

    public function departmentNoPass() {
        $id = $_POST['id'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $no_pass_department = Department::select('department_code', 'department_name','is_check')->where('id',$id)->withTrashed()->get()->toArray();
//        print_r($pass_user);
//        exit();
        $no_pass_department_code = $no_pass_department[0]['department_code'];
        $no_pass_department_name = $no_pass_department[0]['department_name'];
        $no_pass_department_isCheck = $no_pass_department[0]['is_check'];

        $ip_address = $_SERVER['REMOTE_ADDR'];
        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."审核不通过了部门代码为".$no_pass_department_code."的".$no_pass_department_name.'的信息';
//        $needPassUser = User::where('id',$id)->withTrashed()->first();
//        print_r($needPassUser->is_check);
//        exit();
        if($no_pass_department_isCheck == 2) {  //增
            DB::beginTransaction();
            try {
                $needPassDepartment = Department::where('id',$id)->withTrashed()->first();
                $needPassDepartment -> is_check = 1;
                $needPassDepartment -> save();
                $needPassDepartment -> delete();

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

        }else if($no_pass_department_isCheck == 3) { //删
            DB::beginTransaction();
            try {
                $needPassDepartment = Department::where('id',$id)->withTrashed()->first();
                $needPassDepartment -> is_check = 1;
                $needPassDepartment -> restore();

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

        }else if($no_pass_department_isCheck == 4) { //改
            DB::beginTransaction();
            try {
                $needPassDepartmentHistory = DepartmentHistory::where('id_ref',$id)->first();

                $needPassDepartment = Department::where('id',$id)->first();
                $needPassDepartment -> department_code = $needPassDepartmentHistory->department_code;
                $needPassDepartment -> department_name = $needPassDepartmentHistory->department_name;
                $needPassDepartment -> department_tel = $needPassDepartmentHistory->department_tel;
                $needPassDepartment -> partent_id = $needPassDepartmentHistory->partent_id;

                $needPassDepartment -> is_check = 1;
                $needPassDepartment -> save();
                $needPassDepartmentHistory -> delete();

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