package com.erp.app.repository.custom;

import com.erp.app.domain.custom.ResolutionCustom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResolutionCustomRepository extends MongoRepository<ResolutionCustom, String> {

}
