package com.erp.app.repository.custom;

import com.erp.app.domain.custom.StepCustom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StepCustomRepository extends MongoRepository<StepCustom, String> {

}
