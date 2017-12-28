<?php
use NoahBuscher\Macaw\Macaw;
$uri=$_SERVER['REQUEST_URI'];
//echo $uri;
//exit();
//Macaw::get("tinylaravel/hello",function (){
//    echo 'hello';
//});
header("Access-Control-Allow-Origin:*");
//Macaw::get('tinylaravel/world',function (){
//    echo 'world';
//});
Macaw::get('manageSystem/index','IndexController@index');
Macaw::post('manageSystem/login','LoginController@login');
Macaw::post('manageSystem/fetchUserInfor','IndexController@fetchUserInfor');
Macaw::post('manageSystem/insertUser','IndexController@insertUser');
Macaw::post('manageSystem/fetchLogInfor','LogController@fetchLogInfor');
Macaw::post('manageSystem/fetchRoles','RoleController@fetchRoles');
Macaw::post('manageSystem/deleteUser','IndexController@deleteUser');
Macaw::post('manageSystem/getCheckUserInfor','IndexController@getCheckUserInfor');
Macaw::post('manageSystem/updateUser','IndexController@updateUser');
Macaw::post('manageSystem/fetchDepartments','DepartmentController@fetchDepartments');
Macaw::post('manageSystem/pass','IndexController@pass');
Macaw::post('manageSystem/noPass','IndexController@noPass');
Macaw::post('manageSystem/getDepartmentsInfor','DepartmentController@getDepartmentsInfor');
Macaw::post('manageSystem/getRolesInfor','RoleController@getRolesInfor');
Macaw::post('manageSystem/insertRole','RoleController@insertRole');
Macaw::post('manageSystem/insertDepartment','DepartmentController@insertDepartment');
Macaw::post('manageSystem/deleteRole','RoleController@deleteRole');
Macaw::post('manageSystem/deleteDepartment','DepartmentController@deleteDepartment');
Macaw::post('manageSystem/getCheckRoleInfor','RoleController@getCheckRoleInfor');
Macaw::post('manageSystem/getCheckDepartmentInfor','DepartmentController@getCheckDepartmentInfor');
Macaw::post('manageSystem/updateRole','RoleController@updateRole');
Macaw::post('manageSystem/updateDepartment','DepartmentController@updateDepartment');
Macaw::post('manageSystem/rolePass','RoleController@rolePass');
Macaw::post('manageSystem/roleNoPass','RoleController@roleNoPass');
Macaw::post('manageSystem/departmentPass','DepartmentController@departmentPass');
Macaw::post('manageSystem/departmentNoPass','DepartmentController@departmentNoPass');

Macaw::$error_callback = function(){
    throw new Exception("路由无匹配 404 NOT FOUND");
};

Macaw::dispatch();
