package com.erp.app.repository.custom;

import com.erp.app.domain.custom.CustomStep;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StepCustomRepository extends MongoRepository<CustomStep, String> {

}
