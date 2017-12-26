<?php
/**
 * Created by PhpStorm.
 * User: shuxiaotai
 * Date: 2017/12/16
 * Time: 18:32
 */
use model\orm\User;
use model\orm\Department;
use model\orm\Role;
use Illuminate\Database\Capsule\Manager as DB;
use model\orm\Log;
use model\orm\UserHistory;
class IndexController extends BaseController {
    public function index(){
        $this->view = View::create('index');
    }
    public function judgePermission () {
        $staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $judge = User::where('staff_code', $staff_code)->join('role','user.role_id','=','role.id')
            ->select('permission')->get()->toArray();
        return json_decode($judge[0]['permission'], true);
    }
    public function fetchUserInfor() {
        $staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $userPermission = $this->judgePermission();
//        $is_check = User::select('is_check')->where('staff_code', $staff_code)->get()->toArray();
//        $is_check = json_decode($is_check[0]['is_check'], true);
//        print_r($is_check);
//        exit();
        if(in_array(1,$userPermission)){     //管理员
            $userAdminData = User::select('user.id as key','staff_code','username','department_name','education','major','age','address','role_id','email','user.is_check','role_name')
                ->join('department','user.department_id','=','department.id')
                ->join('role','user.role_id','=','role.id')
                ->get()->toArray();
            $userData = $userAdminData;
//            print_r($userData);
//            exit();
        }else if(in_array(2,$userPermission)) {  //审核员
            $userCheckData = User::select('user.id as key','staff_code','username','department_name','education','major','age','address','role_id','email','user.is_check','role_name')
                ->join('department','user.department_id','=','department.id')
                ->join('role','user.role_id','=','role.id')
                ->where('user.is_check',0)->get()->toArray();
            $userData = $userCheckData;
//            print_r($userData);
//            exit();
        }
        foreach ($userData as $key => $item) {
            if ($item['is_check']===1) $userData[$key]['is_check'] = '已审核';
            else $userData[$key]['is_check'] = '待审核';
        }
        $this->json_die(200,'success',$userData);
    }
    public function insertUser() {
        $staff_code = $_POST['staff_code'];
        $username = $_POST['username'];
        $password = md5(123456);
        $department_name = isset($_POST['department_name'])?$_POST['department_name']:'';
        $education = isset($_POST['education'])?$_POST['education']:'';
        $major = isset($_POST['major'])?$_POST['major']:'';
        $age = isset($_POST['age'])?$_POST['age']:'';
        $email = isset($_POST['email'])?$_POST['email']:'';
        $role_name = isset($_POST['role_name'])?$_POST['role_name']:'';
        $address = isset($_POST['address'])?$_POST['address']:'';
        $is_check = 0;

        $department_id = Department::select('id')->where('department_name',$department_name)->get()->toArray();
        $department_id = $department_id[0]['id'];
//        print_r($department_name);
//        exit();

        $role_id = Role::select('id')->where('role_name', $role_name)->get()->toArray();
        $role_id = $role_id[0]['id'];

//        print_r($role_name);
//        exit();

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."添加了员工号为".$staff_code."的".$username;
//        print_r($operation);
//        exit();
        if(User::where('staff_code',$staff_code)->count() === 0){
            DB::beginTransaction();
            try {
                $userPermission = $this->judgePermission();
                if(in_array(1,$userPermission)) {   //管理员
                    $user = User::create([
                        'staff_code' => $staff_code,
                        'username' => $username,
                        'password' => $password,
                        'department_id' => $department_id,
                        'education' => $education,
                        'major' => $major,
                        'age' => (int)$age,
                        'email' => $email,
                        'role_id' => $role_id,
                        'address' => $address,
                        'is_check' => $is_check
                    ]);
                    $ip_address = $_SERVER['REMOTE_ADDR'];
                    $log = Log::create([
                        'ip_address' => $ip_address,
                        'user_id' => $oper_user_id,
                        'operation' => $operation
                    ]);
                    DB::commit();
                    $this->json_die(200, 'success', $log->id);
                }else $this->json_die(402, 'no permission', '');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->json_die(500, 'unknown error', $e);
            }
        } else $this->json_die(403, 'staff has existed', '');
//        print_r($userIsRepeat);
        //$_SERVICE['REMOTE_ADDR'];

    }
    public function deleteUser() {
        $id = $_POST['id'];
        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $deleted_user = User::select('staff_code', 'username')->where('id',$id)->get()->toArray();
        $deleted_user_staff_code = $deleted_user[0]['staff_code'];
        $deleted_user_username = $deleted_user[0]['username'];

        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."删除了员工号为".$deleted_user_staff_code."的".$deleted_user_username;
        DB::beginTransaction();
        try {
            $userPermission = $this->judgePermission();
            if(in_array(1,$userPermission)) {   //管理员
                User::find($id)->delete();
                $ip_address = $_SERVER['REMOTE_ADDR'];
                Log::create([
                    'ip_address' => $ip_address,
                    'user_id' => $oper_user_id,
                    'operation' => $operation
                ]);
                DB::commit();
                $this->json_die(200, 'success');
            }else $this->json_die(402, 'no permission', '');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->json_die(500, 'unknown error', $e);
        }
    }

    public function getCheckUserInfor() {
        $id = $_POST['id'];
        $checkUserInfor = User::select('staff_code','username','department_name','education','major','age','address','role_id','email','user.is_check','role_name')
            ->where('user.id',$id)
            ->join('department','user.department_id','=','department.id')
            ->join('role','user.role_id','=','role.id')
            ->get()->toArray();
//        print_r($checkUserInfor[0]['staff_code']);
//        exit();
        if($checkUserInfor)$this->json_die(200, 'success',$checkUserInfor);
        else $this->json_die(500, 'unknown error');
    }

    public function updateUser() {
        $checkUserStaffCode = $_POST['checkUserStaffCode'];
        $checkUserUsername = $_POST['checkUserUsername'];
        $checkUserDepartmentName = $_POST['checkUserDepartmentName'];
        $checkUserEducation = $_POST['checkUserEducation'];
        $checkUserMajor = $_POST['checkUserMajor'];
        $checkUserAge = $_POST['checkUserAge'];
        $checkUserEmail = $_POST['checkUserEmail'];
        $checkUserRoleName = $_POST['checkUserRoleName'];
        $checkUserAddress = $_POST['checkUserAddress'];

        $id = $_POST['id'];
        $staff_code = $_POST['staff_code'];
        $username = $_POST['username'];
        $password = md5(123456);
        $department_name = isset($_POST['department_name'])?$_POST['department_name']:'';
        $education = isset($_POST['education'])?$_POST['education']:'';
        $major = isset($_POST['major'])?$_POST['major']:'';
        $age = isset($_POST['age'])?$_POST['age']:'';
        $email = isset($_POST['email'])?$_POST['email']:'';
        $role_name = isset($_POST['role_name'])?$_POST['role_name']:'';
        $address = isset($_POST['address'])?$_POST['address']:'';
        $is_check = 0;

        $department_id = Department::select('id')->where('department_name',$department_name)->get()->toArray();
        $department_id = $department_id[0]['id'];

        $role_id = Role::select('id')->where('role_name', $role_name)->get()->toArray();
        $role_id = $role_id[0]['id'];

        $department_history_id = Department::select('id')->where('department_name',$checkUserDepartmentName)->get()->toArray();
        $department_history_id = $department_history_id[0]['id'];

        $role_history_id = Role::select('id')->where('role_name', $checkUserRoleName)->get()->toArray();
        $role_history_id = $role_history_id[0]['id'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $update_user = User::select('staff_code', 'username')->where('id',$id)->get()->toArray();
        $update_user_staff_code = $update_user[0]['staff_code'];
        $update_user_username = $update_user[0]['username'];

        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."修改了员工号为".$update_user_staff_code."的".$update_user_username.'的信息';
//        $userUpdate = User::where('id',$id)->first()->staff_code;
//        print_r($userUpdate);
//        exit();
//        print_r($checkUserInfor);
//        exit();
        if(User::where('staff_code',$staff_code)->count() === 1){
            DB::beginTransaction();
            try {
                $userPermission = $this->judgePermission();
                if(in_array(1,$userPermission)) {   //管理员
                    $userUpdate = User::where('id',$id)->first();
                    $userUpdate->staff_code = $staff_code;
                    $userUpdate->username = $username;
                    $userUpdate->password = $password;
                    $userUpdate->department_id = $department_id;
                    $userUpdate->education = $education;
                    $userUpdate->major = $major;
                    $userUpdate->age = $age;
                    $userUpdate->email = $email;
                    $userUpdate->role_id = $role_id;
                    $userUpdate->address = $address;
                    $userUpdate->is_check = $is_check;
                    $userUpdate->save();
//
                    $userHistory = UserHistory::create([
                        'staff_code' => $checkUserStaffCode,
                        'username' => $checkUserUsername,
                        'department_id' => $department_history_id,
                        'education' => $checkUserEducation,
                        'major' => $checkUserMajor,
                        'age' => (int)$checkUserAge,
                        'email' => $checkUserEmail,
                        'role_id' => $role_history_id,
                        'address' => $checkUserAddress,
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
    }
    public function pass() {
        $id = $_POST['id'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $pass_user = User::select('staff_code', 'username')->where('id',$id)->get()->toArray();
//        print_r($pass_user);
//        exit();
        $pass_user_staff_code = $pass_user[0]['staff_code'];
        $pass_user_username = $pass_user[0]['username'];

        $ip_address = $_SERVER['REMOTE_ADDR'];
        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."审核通过了员工号为".$pass_user_staff_code."的".$pass_user_username.'的信息';

        DB::beginTransaction();
        try {
            $needPassUser = User::where('id',$id)->first();
            $needPassUser -> is_check = 1;
            $needPassUser -> save();

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
//        print_r($needPassUser->is_check);
//        exit();
    }

    public function noPass() {
        $id = $_POST['id'];

        $oper_staff_code = json_decode($_COOKIE['userInfo'],true)['staff_code'];
        $oper_user = User::select('id','username')->where('staff_code', $oper_staff_code)->get()->toArray();
        $oper_user_id = $oper_user[0]['id'];
        $oper_user_name = $oper_user[0]['username'];

        $no_pass_user = User::select('staff_code', 'username')->where('id',$id)->get()->toArray();
//        print_r($pass_user);
//        exit();
        $no_pass_user_staff_code = $no_pass_user[0]['staff_code'];
        $no_pass_user_username = $no_pass_user[0]['username'];

        $ip_address = $_SERVER['REMOTE_ADDR'];
        $operation = "员工号为".$oper_staff_code."的".$oper_user_name."审核不通过了员工号为".$no_pass_user_staff_code."的".$no_pass_user_username.'的信息';

        DB::beginTransaction();
        try {
            $needPassUser = User::where('id',$id)->first();
            $needPassUser -> is_check = 1;
            $needPassUser -> save();

            User::find($id)->delete();

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
//        print_r($needPassUser->is_check);
//        exit();
    }
}