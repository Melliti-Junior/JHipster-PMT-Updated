package com.erp.app.repository;

import com.erp.app.domain.Epic;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Epic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EpicRepository extends MongoRepository<Epic, String> {

}
