<?php

namespace App\Repository;

use App\Entity\ParkingArea;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ParkingArea>
 *
 * @method ParkingArea|null find($id, $lockMode = null, $lockVersion = null)
 * @method ParkingArea|null findOneBy(array $criteria, array $orderBy = null)
 * @method ParkingArea[]    findAll()
 * @method ParkingArea[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ParkingAreaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ParkingArea::class);
    }

    //    /**
    //     * @return ParkingArea[] Returns an array of ParkingArea objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ParkingArea
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
