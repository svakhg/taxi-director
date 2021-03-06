<?php

namespace Model\Repositories;

use Doctrine\ORM\EntityRepository;
use Model\Taxi;

/**
 * BacktrackRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class BacktrackRepository extends EntityRepository {

    /**
     * Alias of the table
     * @var string
     */
    private $_alias = 'backtrack';

    /**
     * (non-PHPdoc)
     * @see Doctrine\ORM.EntityRepository::findAll()
     */
    public function findAll() {
    	return $this->findBy(array('state' => TRUE));
    }

    /**
     * @param Taxi $taxi
     * @return array The objects.
     */
    public function findByTaxi(Taxi $taxi) {
    	return $this->findBy(array('state' => TRUE, 'taxiId' => $taxi->getId()));
    }

    /**
     * @param Taxi $taxi
     * @return array The objects.
     */
    public function findByTaxiAndStatus(Taxi $taxi, $status) {
        return $this->findBy(array('state' => TRUE, 'taxiId' => $taxi->getId(), 'status' => $status));
    }

    /**
     * Returns models
     * @param Taxi $taxi
     * @param unknown $status
     * @param \DateTime $dateTime
     * @return Ambigous <multitype:, \Doctrine\ORM\mixed, mixed, \Doctrine\DBAL\Driver\Statement, \Doctrine\Common\Cache\mixed>
     */
    public function findByTaxiAndStatusAndDateStatus(Taxi $taxi, $status, \DateTime $dateTime) {
    	$query = $this->_em->createQueryBuilder();

    	$query->select($this->_alias)
            ->from($this->_entityName, $this->_alias)
            ->where("$this->_alias.taxiId = :taxiId AND $this->_alias.status = :status AND $this->_alias.timenow > :timenow AND $this->_alias.state = TRUE")
            ->setParameter('taxiId', $taxi->getId())
            ->setParameter('status', $status)
            ->setParameter('timenow', $dateTime->format('Y-m-d h:i:s'))
        ;

    	$query->orderBy("$this->_alias.timenow", 'ASC');

    	return $query->getQuery()->getResult();
    }

    /**
     * @param Taxi $taxi
     * @return array The objects.
     */
    public function findLastPositionByTaxi(Taxi $taxi) {
    	return $this->findOneBy(array('state' => TRUE, 'taxiId' => $taxi->getId()), array('id' => 'DESC'));
    }
}