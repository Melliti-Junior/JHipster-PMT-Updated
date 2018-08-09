package com.erp.app.repository;

import com.erp.app.domain.Workflow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Workflow entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkflowRepository extends MongoRepository<Workflow, String> {

}
