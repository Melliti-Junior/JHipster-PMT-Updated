package com.erp.app.repository.custom;

import com.erp.app.domain.custom.CustomStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusCustomRepository extends MongoRepository<CustomStatus, String> {

}
