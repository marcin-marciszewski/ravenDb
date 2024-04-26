<?php

namespace App\Exceptions;

use Exception;

class ValidationException extends Exception
{
    public $errors;

    public function __construct($errors)
    {
        parent::__construct('Validation Error');
        $this->errors = $errors;
    }
}
