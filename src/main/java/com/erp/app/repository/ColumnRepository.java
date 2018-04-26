package com.erp.app.repository;

import com.erp.app.domain.Column;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Column entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ColumnRepository extends MongoRepository<Column, String> {

}
