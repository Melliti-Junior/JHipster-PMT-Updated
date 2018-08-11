package com.erp.app.repository.custom;

import com.erp.app.domain.custom.CustomTransition;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransitionCustomRepository extends MongoRepository<CustomTransition, String> {

}
