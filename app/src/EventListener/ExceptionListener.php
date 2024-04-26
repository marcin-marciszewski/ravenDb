<?php

namespace App\EventListener;

use App\Exceptions\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

class ExceptionListener
{
    public function __invoke(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof ValidationException) {
            $messages = [];
            foreach($exception->errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            $response = new Response();
            $response->setContent(json_encode($messages));
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            $event->setResponse($response);
        }
    }
}
