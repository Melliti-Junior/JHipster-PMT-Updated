package com.erp.app.repository;

import com.erp.app.domain.Version;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Version entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VersionRepository extends MongoRepository<Version, String> {

}
