package com.erp.app.repository;

import com.erp.app.domain.IssueType;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the IssueType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IssueTypeRepository extends MongoRepository<IssueType, String> {

}
