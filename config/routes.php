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
Macaw::post('manageSystem/fetchDepartments','departmentController@fetchDepartments');
Macaw::post('manageSystem/pass','IndexController@pass');
Macaw::post('manageSystem/noPass','IndexController@noPass');
Macaw::post('manageSystem/getDepartmentsInfor','departmentController@getDepartmentsInfor');
Macaw::post('manageSystem/getRolesInfor','RoleController@getRolesInfor');
Macaw::$error_callback = function(){
    throw new Exception("路由无匹配 404 NOT FOUND");
};

Macaw::dispatch();
