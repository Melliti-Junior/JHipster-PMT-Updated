package com.erp.app.repository.custom;

import com.erp.app.domain.custom.CustomIssue;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueCustomRepository extends MongoRepository<CustomIssue, String> {

}
