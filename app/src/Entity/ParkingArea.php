<?php

namespace App\Entity;

use App\Repository\ParkingAreaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ParkingAreaRepository::class)]
class ParkingArea
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2)]
    #[Assert\NotBlank]
    #[Assert\GreaterThanOrEqual(0)]
    private ?float $weekday_rate = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2)]
    #[Assert\NotBlank]
    #[Assert\GreaterThanOrEqual(0)]
    private ?float $weekend_rate = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\GreaterThanOrEqual(0)]
    private ?int $discount = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getWeekdayRate(): ?float
    {
        return $this->weekday_rate;
    }

    public function setWeekdayRate(float $weekday_rate): static
    {
        $this->weekday_rate = $weekday_rate;

        return $this;
    }

    public function getWeekendRate(): ?float
    {
        return $this->weekend_rate;
    }

    public function setWeekendRate(float $weekend_rate): static
    {
        $this->weekend_rate = $weekend_rate;

        return $this;
    }

    public function getDiscount(): ?int
    {
        return $this->discount;
    }

    public function setDiscount(int $discount): static
    {
        $this->discount = $discount;

        return $this;
    }
}
