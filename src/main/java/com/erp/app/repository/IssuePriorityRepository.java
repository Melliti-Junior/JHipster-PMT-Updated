package com.erp.app.repository;

import com.erp.app.domain.IssuePriority;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the IssuePriority entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IssuePriorityRepository extends MongoRepository<IssuePriority, String> {

}
