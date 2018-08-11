package com.erp.app.repository.custom;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.erp.app.domain.custom.CustomProject;

@Repository
public interface ProjectCustomRepository extends MongoRepository<CustomProject, String> {

}
