package com.erp.app.repository;

import com.erp.app.domain.Issue;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Issue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IssueRepository extends MongoRepository<Issue, String> {

}
