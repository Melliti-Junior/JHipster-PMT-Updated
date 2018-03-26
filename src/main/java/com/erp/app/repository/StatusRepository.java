package com.erp.app.repository;

import com.erp.app.domain.Status;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Status entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StatusRepository extends MongoRepository<Status, String> {

}
