package com.erp.app.repository;

import com.erp.app.domain.Step;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Step entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StepRepository extends MongoRepository<Step, String> {

}
