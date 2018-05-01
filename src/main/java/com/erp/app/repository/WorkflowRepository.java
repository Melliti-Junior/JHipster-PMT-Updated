package com.erp.app.repository;

import com.erp.app.domain.Workflow;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Workflow entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkflowRepository extends MongoRepository<Workflow, String> {

}
