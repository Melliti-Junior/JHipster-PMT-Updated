package com.erp.app.repository;

import com.erp.app.domain.Program;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Program entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProgramRepository extends MongoRepository<Program, String> {

}
