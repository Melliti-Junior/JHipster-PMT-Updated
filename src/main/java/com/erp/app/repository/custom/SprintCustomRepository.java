package com.erp.app.repository.custom;

import com.erp.app.domain.custom.SprintCustom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SprintCustomRepository extends MongoRepository<SprintCustom, String> {

}
