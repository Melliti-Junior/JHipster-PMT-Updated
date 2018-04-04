package com.erp.app.repository;

import com.erp.app.domain.Version;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Version entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VersionRepository extends MongoRepository<Version, String> {

}
