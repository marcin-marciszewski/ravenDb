<?php

namespace App\Controller;

use App\Entity\ParkingArea;
use App\Exceptions\ValidationException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api', name: 'api_')]
class ParkingAreaController extends AbstractController
{
    public function __construct(
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('/parking-areas', name: 'parking_areas_index', methods: ['get'])]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $parkingAreas = $doctrine
        ->getRepository(ParkingArea::class)
        ->findAll();

        return JsonResponse::fromJsonString($this->serializer->serialize($parkingAreas, 'json'));

    }

    #[Route('/parking-areas', name: 'parking_area_create', methods: ['post'])]
    public function create(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        $parkingArea = $this->serializer->deserialize($request->getContent(), ParkingArea::class, 'json');

        $validationErrors =  $this->validator->validate($parkingArea);

        if (count($validationErrors) > 0) {
            throw new ValidationException($validationErrors);
        }

        $entityManager->persist($parkingArea);
        $entityManager->flush();

        return $this->json($this->serializer->serialize($parkingArea, 'json'));
    }

    #[Route('/parking-areas/{id}', name: 'parking_area_update', methods: ['put', 'patch'])]
    public function update(ManagerRegistry $doctrine, Request $request, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $parkingArea = $entityManager->getRepository(ParkingArea::class)->find($id);

        if (!$parkingArea) {
            return $this->json(['error' => 'No parking area found for id ' . $id], 404);
        }

        $requestData = json_decode($request->getContent());

        if (!$requestData) {
            return $this->json(["error" => "Invalid request data"], 400);
        }

        if (isset($requestData->name)) {
            $parkingArea->setName($requestData->name);
        }
        if (isset($requestData->weekdayRate)) {
            $parkingArea->setWeekdayRate($requestData->weekdayRate);
        }
        if (isset($requestData->weekendRate)) {
            $parkingArea->setWeekendRate($requestData->weekendRate);
        }
        if (isset($requestData->discount)) {
            $parkingArea->setDiscount($requestData->discount);
        }

        $entityManager->flush();

        return $this->json($this->serializer->serialize($parkingArea, 'json'));
    }

    #[Route('/parking-areas/{id}', name: 'parking_areas_delete', methods: ['delete'])]
    public function delete(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $parkingArea = $entityManager->getRepository(ParkingArea::class)->find($id);

        if (!$parkingArea) {
            return $this->json(['error' => 'No parking area found for id ' . $id], 404);
        }

        $entityManager->remove($parkingArea);
        $entityManager->flush();

        return $this->json('Deleted a task successfully with id ' . $id);
    }
}
