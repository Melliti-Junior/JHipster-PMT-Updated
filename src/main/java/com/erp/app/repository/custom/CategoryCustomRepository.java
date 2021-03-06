package com.erp.app.repository.custom;

import com.erp.app.domain.custom.CustomCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryCustomRepository extends MongoRepository<CustomCategory, String> {

}
