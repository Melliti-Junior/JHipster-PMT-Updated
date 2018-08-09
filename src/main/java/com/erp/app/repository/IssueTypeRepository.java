package com.erp.app.repository;

import com.erp.app.domain.IssueType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the IssueType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IssueTypeRepository extends MongoRepository<IssueType, String> {

}
