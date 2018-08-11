package com.erp.app.repository.custom;

import com.erp.app.domain.custom.CustomWorkflow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkflowCustomRepository extends MongoRepository<CustomWorkflow, String> {

}
