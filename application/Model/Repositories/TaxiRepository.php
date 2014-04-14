<?php

namespace Model\Repositories;

use Doctrine\ORM\EntityRepository;

/**
 * TaxiRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class TaxiRepository extends EntityRepository {

    /**
     * Alias of the table
     * @var string
     */
    private $_alias = 'taxi';

    /**
     * Returns models according the filters
     * @param array $filters
     * @param int $limit
     * @param int $offset
     * @param int $sortColumn
     * @param string $sortDirection
     * @return Array Objects
     */
    public function findByCriteria($filters = array(), $limit = NULL, $offset = NULL, $sortColumn = NULL, $sortDirection = NULL) {
    	$query = $this->_em->createQueryBuilder();

    	$condName = "";
    	foreach ($filters as $filter) {
    		$condName = "$this->_alias.status = :status AND ";
    		$query->setParameter($filter['field'], $filter['filter']);
    	}

    	$query->select($this->_alias)
    	->from($this->_entityName, $this->_alias)
    	->where("$condName $this->_alias.state = TRUE")
    	->setFirstResult($offset)
    	->setMaxResults($limit)
    	;

    	$sort = '';
    	switch ($sortColumn) {
    		case 1:
    			$sort = 'name';
    			break;

    		case 2:
    			$sort = 'description';
    			break;

    		case 3:
    			$sort = 'created';
    			break;

    		case 4:
    			$sort = 'changed';
    			break;

    		default: $sort = 'id'; $sortDirection = 'desc';
    	}

    	$query->orderBy("$this->_alias.$sort", $sortDirection);

    	return $query->getQuery()->getResult();
    }

    /**
     * Finds total count of models according the filters
     * @param array $filters
     * @return int
     */
    public function getTotalCount($filters = array()) {
    	$query = $this->_em->createQueryBuilder();

    	$condName = "";
    	foreach ($filters as $filter) {
    		$condName = "$this->_alias.name LIKE :name AND ";
    		$query->setParameter($filter['field'], $filter['filter']);
    	}

    	$query->select("count($this->_alias.id)")
    	->from($this->_entityName, $this->_alias)
    	->where("$condName $this->_alias.state = TRUE");

    	return (int)$query->getQuery()->getSingleScalarResult();
    }

    /**
     * (non-PHPdoc)
     * @see Doctrine\ORM.EntityRepository::findAll()
     */
    public function findAll() {
    	return $this->findBy(array('state' => TRUE));
    }

    /**
     * Returns all club pathfinders
     * @return array
     */
    public function findAllArray() {
    	$items = $this->findAll();

    	$itemArray = array();
    	foreach ($items as $item) {
    		$itemArray[$item->getId()] = $item->getName();
    	}

    	return $itemArray;
    }

    /**
     * Returns the taxi models by status
     * @param int $status
     * @return array
     */
    public function findByStatusArray($status) {
    	$items = $this->findBy(array('state' => TRUE, 'status' => $status));

    	$itemArray = array();
    	foreach ($items as $item) {
    		$itemArray[$item->getId()] = $item->getName();
    	}

    	return $itemArray;
    }

    /**
     * Returns the taxi models by status
     * @param int $status
     * @return array
     */
    public function findByStatusArrayNumber($status) {
        $items = $this->findBy(array('state' => TRUE, 'status' => $status));

        $itemArray = array();
        $itemArray[-1] = _('--Seleccione--');
        foreach ($items as $item) {
            $itemArray[$item->getId()] = $item->getNumber();
        }

        return $itemArray;
    }

    /**
     * Verifies if the number already exist it.
     * @param int $number
     * @return boolean
     */
    public function verifyExistNumber($number) {
        $object = $this->findOneBy(array('number' => $number, 'state' => TRUE));
        return $object != NULL? TRUE : FALSE;
    }

    /**
     * Verifies if the id and number already exist it.
     * @param int $id
     * @param int $number
     */
    public function verifyExistIdAndNumber($id, $number) {
        $object = $this->findOneBy(array('id' => $id, 'number' => $number, 'state' => TRUE));
        return $object != NULL? TRUE : FALSE;
    }
}