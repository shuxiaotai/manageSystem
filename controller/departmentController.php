<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/20
 * Time: 10:31
 */

use model\orm\Department;
use model\orm\User;
class departmentController extends BaseController {
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
            $departmentParentId = Department::select('parent_id');
            print_r($departmentParentId);
            exit();

            $departmentData = Department::select('department.id as key','department_code','department_name','department_tel', 'parent_id','is_check')
                ->get()->toArray();
        }
//        print_r($departmentData);
//        exit();
        foreach ($departmentData as $key => $item) {
            if ($item['is_check']===1) $departmentData[$key]['is_check'] = '已审核';
            else $departmentData[$key]['is_check'] = '待审核';
        }
        $this->json_die(200,'success',$departmentData);
    }
}