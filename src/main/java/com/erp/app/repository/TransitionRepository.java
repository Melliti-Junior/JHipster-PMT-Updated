package com.erp.app.repository;

import com.erp.app.domain.Transition;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Transition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransitionRepository extends MongoRepository<Transition, String> {

}
