package com.erp.app.repository;

import com.erp.app.domain.IssuePriority;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the IssuePriority entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IssuePriorityRepository extends MongoRepository<IssuePriority, String> {

}
