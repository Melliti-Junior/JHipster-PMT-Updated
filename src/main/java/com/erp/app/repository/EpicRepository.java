package com.erp.app.repository;

import com.erp.app.domain.Epic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Epic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EpicRepository extends MongoRepository<Epic, String> {

}
