<?php
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\Length;
$validator = Validation::createValidator();
$validators = $validator->validate('hello',new Length(11));