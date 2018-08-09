package com.erp.app.repository;

import com.erp.app.domain.Resolution;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Resolution entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ResolutionRepository extends MongoRepository<Resolution, String> {

}
