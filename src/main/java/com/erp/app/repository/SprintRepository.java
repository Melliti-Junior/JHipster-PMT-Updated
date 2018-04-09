package com.erp.app.repository;

import com.erp.app.domain.Sprint;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Sprint entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SprintRepository extends MongoRepository<Sprint, String> {

}
