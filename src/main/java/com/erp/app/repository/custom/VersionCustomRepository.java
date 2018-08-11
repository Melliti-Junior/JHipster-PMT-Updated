package com.erp.app.repository.custom;

import com.erp.app.domain.custom.CustomVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VersionCustomRepository extends MongoRepository<CustomVersion, String> {

}
