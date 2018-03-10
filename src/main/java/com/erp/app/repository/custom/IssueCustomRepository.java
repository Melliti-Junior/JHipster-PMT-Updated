package com.erp.app.repository.custom;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.erp.app.domain.custom.IssueCustom;

@Repository
public interface IssueCustomRepository extends MongoRepository<IssueCustom, String> {

}
